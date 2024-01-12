const express = require('express');
const router = express.Router();
const UserController = require("../controllers/userController");

router.get('/users', UserController.getAllUsers);
router.get('/users/:id', UserController.getUserById);
router.post('/users/login', UserController.loginUser);
router.post('/users/register', UserController.registerUser);
router.put('/users/update/:id', UserController.updateUser);
router.put('/users/delete/:id', UserController.updateUserStatus);

module.exports = router;