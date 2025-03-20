// routes/categoryRoutes.js
import express from 'express';
import categoryService from '../services/categoryService.js';

const router = express.Router();
router.get('/', async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (err) {
    console.error('Error getting categories:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route GET /api/categories/stats
 * @desc Get category statistics
 * @access Public
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await categoryService.getCategoryStats();
    res.json(stats);
  } catch (err) {
    console.error('Error getting category stats:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route GET /api/categories/:id
 * @desc Get category by ID
 * @access Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (err) {
    console.error('Error getting category:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route GET /api/categories/:id/hazards
 * @desc Get category with all its hazards
 * @access Public
 */
router.get('/:id/hazards', async (req, res) => {
  try {
    const { id } = req.params;
    const categoryWithHazards = await categoryService.getCategoryWithHazards(id);
    
    if (!categoryWithHazards) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(categoryWithHazards);
  } catch (err) {
    console.error('Error getting category with hazards:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route POST /api/categories
 * @desc Create a new category
 * @access Private
 */
router.post('/', async (req, res) => {
  try {
    const { category_id, name } = req.body;
    
    // Validate required fields
    if (!category_id || !name) {
      return res.status(400).json({ 
        message: 'Please provide category ID and name' 
      });
    }
    
    // Create the category
    const category = await categoryService.createCategory({
      category_id,
      name
    });
    
    res.status(201).json(category);
  } catch (err) {
    console.error('Error creating category:', err);
    
    // Handle duplicate key error
    if (err.code === '23505') {
      return res.status(400).json({ message: 'Category ID already exists' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route PUT /api/categories/:id
 * @desc Update a category
 * @access Private
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: 'Please provide category name' });
    }
    
    // Check if category exists
    const existingCategory = await categoryService.getCategoryById(id);
    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Update the category
    const category = await categoryService.updateCategory(id, { name });
    
    res.json(category);
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route DELETE /api/categories/:id
 * @desc Delete a category
 * @access Private
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete the category (hazards will be deleted automatically due to CASCADE)
    const success = await categoryService.deleteCategory(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;