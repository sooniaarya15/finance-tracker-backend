const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateName, validateEmail, validatePassword } = require('../utils/validators');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  token: generateToken(user._id),
});

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const error =
      validateName(name) || validateEmail(email) || validatePassword(password);
    if (error) return res.status(400).json({ message: error });

    const cleanEmail = email.trim().toLowerCase();
    const exists = await User.findOne({ email: cleanEmail });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
    });
    res.status(201).json(userResponse(user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const error = validateEmail(email) || (!password ? 'Password is required' : '');
    if (error) return res.status(400).json({ message: error });

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json(userResponse(user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  res.json(req.user);
};