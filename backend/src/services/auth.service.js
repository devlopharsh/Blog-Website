const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

exports.register = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return await User.create({
    ...data,
    password: hashedPassword,
  });
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw { status: 404, message: 'User not found' };

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw { status: 401, message: 'Invalid credentials' };

  return user;
};

exports.generateResetToken = async (user) => {
  const resetToken = crypto.randomBytes(32).toString('hex');

  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min

  await user.save();

  return resetToken;
};

exports.resetPassword = async (token, password) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) throw { status: 400, message: 'Invalid or expired token' };

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return user;
};