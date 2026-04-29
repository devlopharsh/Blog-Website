const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth.controller');

router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.post('/forgot-password', controller.forgotPassword);
router.put('/reset-password/:token', controller.resetPassword);

module.exports = router;