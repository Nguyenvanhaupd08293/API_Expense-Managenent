const express = require('express');
const router = express.Router();
const { getProject, getProjectById, addProject, updateProject, deleteProject } = require('../controllers/project')
router.get('/pros', getProject);
router.get('/project/:id', getProjectById);
router.post('/project', addProject);
router.put('/project/:id', updateProject);
router.delete('/project/:id', deleteProject);
module.exports = router;