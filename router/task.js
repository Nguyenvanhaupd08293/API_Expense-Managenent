const express = require('express');
const router = express.Router();
const { getAllTasks, getTaskById, addTask, updateTask, deleteTask } = require('../controllers/task');
router.get('/task', getAllTasks);
router.get('/task/:id', getTaskById);
router.post('/task', addTask);
router.put('/task/:id', updateTask);
router.delete('/task/:id', deleteTask);
module.exports = router;