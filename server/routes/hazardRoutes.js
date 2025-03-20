// routes/hazardRoutes.js
import express from 'express';
import hazardService from '../services/hazardService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const hazards = await hazardService.getAllHazards();
    res.json(hazards);
  } catch (err) {
    console.error('Error getting hazards:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route GET /api/hazards/search
 * @desc Search hazards by description
 * @access Public
 */
router.get('/search', async (req, res) => {
  try {
    const { term } = req.query;
    if (!term) {
      return res.status(400).json({ message: 'Search term is required' });
    }
    
    const hazards = await hazardService.searchHazards(term);
    res.json(hazards);
  } catch (err) {
    console.error('Error searching hazards:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route GET /api/hazards/filter
 * @desc Filter hazards by impact type
 * @access Public
 */
router.get('/filter', async (req, res) => {
  try {
    const filters = {
      health: req.query.health === 'true',
      safety: req.query.safety === 'true',
      security: req.query.security === 'true',
      environment: req.query.environment === 'true',
      social: req.query.social === 'true'
    };
    
    const hazards = await hazardService.filterHazardsByImpact(filters);
    res.json(hazards);
  } catch (err) {
    console.error('Error filtering hazards:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route GET /api/hazards/category/:categoryId
 * @desc Get hazards by category
 * @access Public
 */
router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const hazards = await hazardService.getHazardsByCategory(categoryId);
    res.json(hazards);
  } catch (err) {
    console.error('Error getting hazards by category:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route GET /api/hazards/:id
 * @desc Get hazard by ID
 * @access Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const hazard = await hazardService.getHazardById(id);
    
    if (!hazard) {
      return res.status(404).json({ message: 'Hazard not found' });
    }
    
    res.json(hazard);
  } catch (err) {
    console.error('Error getting hazard:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route POST /api/hazards
 * @desc Create a new hazard
 * @access Private
 */
router.post('/', async (req, res) => {
  try {
    const { 
      id, 
      category_id, 
      description, 
      health, 
      safety, 
      security, 
      environment, 
      social, 
      sources 
    } = req.body;
    
    // Validate required fields
    if (!id || !category_id || !description) {
      return res.status(400).json({ 
        message: 'Please provide hazard ID, category ID, and description' 
      });
    }
    
    // Create the hazard
    const hazard = await hazardService.createHazard({
      id,
      category_id,
      description,
      health: health || false,
      safety: safety || false,
      security: security || false,
      environment: environment || false,
      social: social || false,
      sources
    });
    
    res.status(201).json(hazard);
  } catch (err) {
    console.error('Error creating hazard:', err);
    
    // Handle duplicate key error
    if (err.code === '23505') {
      return res.status(400).json({ message: 'Hazard ID already exists' });
    }
    
    // Handle foreign key error
    if (err.code === '23503') {
      return res.status(400).json({ message: 'Category does not exist' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route PUT /api/hazards/:id
 * @desc Update a hazard
 * @access Private
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      category_id, 
      description, 
      health, 
      safety, 
      security, 
      environment, 
      social, 
      sources 
    } = req.body;
    
    // Validate required fields
    if (!category_id || !description) {
      return res.status(400).json({ 
        message: 'Please provide category ID and description' 
      });
    }
    
    // Check if hazard exists
    const existingHazard = await hazardService.getHazardById(id);
    if (!existingHazard) {
      return res.status(404).json({ message: 'Hazard not found' });
    }
    
    // Update the hazard
    const hazard = await hazardService.updateHazard(id, {
      category_id,
      description,
      health: health || false,
      safety: safety || false,
      security: security || false,
      environment: environment || false,
      social: social || false,
      sources
    });
    
    res.json(hazard);
  } catch (err) {
    console.error('Error updating hazard:', err);
    
    // Handle foreign key error
    if (err.code === '23503') {
      return res.status(400).json({ message: 'Category does not exist' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route DELETE /api/hazards/:id
 * @desc Delete a hazard
 * @access Private
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete the hazard
    const success = await hazardService.deleteHazard(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Hazard not found' });
    }
    
    res.json({ message: 'Hazard deleted successfully' });
  } catch (err) {
    console.error('Error deleting hazard:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;