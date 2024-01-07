// controllers/userController.js
const crypto = require('crypto');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/accounts');
const createHashedPassword = require('../middleware/hashPass');

const UserController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await UserModel.find();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getUserById: async (req, res) => {
    const userId = req.params.id;

    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  createUser: async (req, res) => {
    const { email, password } = req.body;
    const salt = crypto.randomBytes(16).toString('hex');
    let hash;

    await createHashedPassword(password, salt)
      .then(hashedPassword => hash = hashedPassword)
      .catch(error => console.error(error));

    try {
      const existingUser = await UserModel.findOne({ email });

      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      if (existingUser) {
        return res.status(400).json({ detail: 'Email already exists' });
      }

      const newUser = await UserModel.create({ email, password: hash });
      const token = jwt.sign(
        { email: newUser.email, userId: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );
      res.status(201).json({ id: newUser._id, email: newUser.email, token });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  updateUser: async (req, res) => {
    const userId = req.params.id;
    const { email, password } = req.body;

    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { email, password },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  deleteUser: async (req, res) => {
    const userId = req.params.id;

    try {
      const deletedUser = await UserModel.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = UserController;
