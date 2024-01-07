require('dotenv').config();

const express = require('express');
const connectDB = require('./config/database')
const UserController = require('./controllers/userController');

const app = express();
app.use(express.json());

connectDB();

app.get('/accounts/users', UserController.getAllUsers);
app.get('/accounts/users/:id', UserController.getUserById);
app.post('/accounts/users', UserController.createUser);
app.put('/accounts/users/:id', UserController.updateUser);
app.delete('/accounts/users/:id', UserController.deleteUser);

const port = 9000;

app.listen(port, () => {
    console.log('Server started on port 9000');
})