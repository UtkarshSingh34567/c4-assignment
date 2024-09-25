// src/extension/route.js
const express = require('express');
const { registerUser, loginUser, saveMetrics, getAllMetrics } = require('./controller');

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/metrics', saveMetrics);

router.get('/dashboard', getAllMetrics);

module.exports = router;
