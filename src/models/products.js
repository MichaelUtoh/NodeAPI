const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: { type: String, default: '', required: true },
        description: { type: String, default: '' },
        image_url: { type: String, default: '' },
        price: { type: String, default: '' },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
        created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    }
)

const Product = mongoose.model('Product', productSchema);
module.exports = Product;