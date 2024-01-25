const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    first_name: { type: String, default: '' },
    last_name: { type: String, default: '' },
    username: { type: String, default: '' },
    phone_number: { type: String, default: '' },
    address1: { type: String, default: '' },
    address2: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: '' },
    key: { type: String, default: '' },
    created_at: { type: Date, default: Date.now },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    iterations: { type: Number, required: true },
    keylen: { type: Number, required: true },
    digest: { type: String, required: true },
    archive: { type: Boolean, default: false },
    status: { type: String, default: '' },

    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;