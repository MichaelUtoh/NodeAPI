require('dotenv').config();

const express = require('express');
const router = express.Router();
const connectDB = require('./config/database')
const UserController = require('./controllers/userController');
const PostController = require('./controllers/postController');

const app = express();
app.use(express.json());

// Database
connectDB();

// Import Routers
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

app.use('/accounts', userRoutes);
app.use('/posts', postRoutes);


const port = 9000;
app.listen(port, () => {
    console.log('Server started on port 9000');
})