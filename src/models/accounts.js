const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String },
    phoneNumber: { type: String },
    address1: { type: String },
    address2: { type: String },
    state: { type: String },
    country: { type: String },
    key: { type: String },
    dateJoined: { type: Date, default: Date.now },
    password: { type: String, required: true }
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;