// controllers/userController.js
const crypto = require('crypto');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/accounts');
const authenticateUser = require('../middleware/authUser');
const { createHashedPassword, validatePassword } = require('../middleware/hashPass');

const UserController = {
  getAllUsers: [authenticateUser, async (req, res) => {
    try {
      const users = await UserModel.find({ archive: false }).select(
        '_id email first_name last_name address1 state country created_at'
      );
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }],

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

  loginUser: async (req, res) => {
    const { email, password } = req.body;

    try {
      const existingUser = await UserModel.findOne({ email });

      if (!existingUser) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      console.log(existingUser);

      const isPasswordValid = await validatePassword(
        password,
        existingUser.password,
        existingUser.salt,
        existingUser.iterations,
        existingUser.keylen,
        existingUser.digest,
      );

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { email: existingUser.email, userId: existingUser._id },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      res.status(200).json({ id: existingUser._id, email: existingUser.email, token });

      res.status(200).json({ 'detail': 'success' })
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  registerUser: async (req, res) => {
    const { email, password } = req.body;
    const salt = crypto.randomBytes(16).toString('hex');
    const hashPassInfo = await createHashedPassword(password, salt)

    try {
      const existingUser = await UserModel.findOne({ email });

      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      if (existingUser) {
        return res.status(400).json({ detail: 'Email already exists' });
      }

      const newUser = await UserModel.create({
        email,
        password: hashPassInfo.hashedPassword,
        salt: hashPassInfo.salt,
        iterations: hashPassInfo.iterations,
        keylen: hashPassInfo.keylen,
        digest: hashPassInfo.digest,
      });

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

  updateUser: [authenticateUser, async (req, res) => {
    const userId = req.params.id;
    const { first_name, last_name, phone_number, address1, state, country, date_joined } = req.body;

    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { first_name, last_name, phone_number, address1, state, country, date_joined },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        address1: updatedUser.address1,
        address2: updatedUser.address2,
        state: updatedUser.state,
        country: updatedUser.country,
        date_joined: updatedUser.created_at,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }],

  updateUserStatus: [authenticateUser, async (req, res) => {
    const userId = req.params.id;
    const { status, archive } = req.body;

    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { status, archive },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        address1: updatedUser.address1,
        address2: updatedUser.address2,
        state: updatedUser.state,
        country: updatedUser.country,
        date_joined: updatedUser.created_at,
        status: updatedUser.status,
        archive: updatedUser.archive,
      })
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }],

  deleteUser: [authenticateUser, async (req, res) => {
    const userId = req.params.id;

    try {
      const deletedUser = await UserModel.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(204).send({});
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }],
};

module.exports = UserController;
