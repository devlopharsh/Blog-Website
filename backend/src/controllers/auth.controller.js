const authService = require('../services/auth.service');
const { generateToken } = require('../utils/token');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/user.model');

exports.signup = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);

    res.status(201).json({
      success: true,
      message: 'User registered',
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await authService.login(
      req.body.email,
      req.body.password
    );

    const token = generateToken(user);

    res.json({
      success: true,
      token,
    });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw { status: 404, message: 'User not found' };

    const resetToken = await authService.generateResetToken(user);

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      'Password Reset',
      `Reset your password: ${resetUrl}`
    );

    res.json({
      success: true,
      message: 'Reset link sent to email',
    });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(
      req.params.token,
      req.body.password
    );

    res.json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (err) {
    next(err);
  }
};