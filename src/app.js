require('dotenv').config();

const express = require('express');
const connectDB = require('./config/database')
const UserController = require('./controllers/userController');

const app = express();
app.use(express.json());

connectDB();

app.get('/accounts/users', UserController.getAllUsers);
app.get('/accounts/users/:id', UserController.getUserById);
app.post('/accounts/users/login', UserController.loginUser);
app.post('/accounts/users/register', UserController.registerUser);
app.put('/accounts/users/update/:id', UserController.updateUser);
app.put('/accounts/users/delete/:id', UserController.updateUserStatus);
// app.delete('/accounts/users/delete/:id', UserController.deleteUser);

const port = 9000;

app.listen(port, () => {
    console.log('Server started on port 9000');
})