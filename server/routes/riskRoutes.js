// routes/riskRoutes.js
import express from 'express';
import riskService from '../services/riskService.js';

const router = express.Router();

// Definisikan routes
router.get('/risks', async (req, res) => {
  try {
    const risks = await riskService.getAllRisks();
    res.json(risks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get risk by ID
router.get('/risks/:id', async (req, res) => {
  try {
    const risk = await riskService.getRiskById(req.params.id);
    if (!risk) {
      return res.status(404).json({ message: 'Risk not found' });
    }
    res.json(risk);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new risk
router.post('/risks', async (req, res) => {
  try {
    const newRisk = await riskService.createRisk(req.body);
    res.status(201).json(newRisk);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update risk
router.put('/risks/:id', async (req, res) => {
  try {
    const updatedRisk = await riskService.updateRisk(req.params.id, req.body);
    if (!updatedRisk) {
      return res.status(404).json({ message: 'Risk not found' });
    }
    res.json(updatedRisk);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete risk
router.delete('/risks/:id', async (req, res) => {
  try {
    const result = await riskService.deleteRisk(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get departments and groups
router.get('/departments', async (req, res) => {
  try {
    const departments = await riskService.getAllDepartments();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/groups', async (req, res) => {
  try {
    const groups = await riskService.getAllGroups();
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;