// controllers/userController.js

const UserModel = require('../models/accounts');

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

        try {
            const newUser = await UserModel.create({ email, password });
            res.status(201).json(newUser);
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
