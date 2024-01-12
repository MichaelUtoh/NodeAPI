const authenticateUser = require('../middleware/authUser');
const ProductModel = require('../models/products')

const ProductController = {
    getAllProducts: [authenticateUser, async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const products = await ProductModel.find({ archive: false })
                .select('_id name description image_url price created_by created_at')
                .skip(skip)
                .limit(limit);

            const count = await ProductModel.countDocuments();
            res.status(200).json({
                products,
                count,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }]
};

module.exports = ProductController;