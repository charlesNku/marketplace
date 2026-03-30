const Product = require('../models/Product.js');

// GET /api/products
const getProducts = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    
    // Search keyword
    const keyword = req.query.keyword
      ? { title: { $regex: req.query.keyword, $options: 'i' } }
      : {};

    // Filter by category
    const category = req.query.category ? { category: req.query.category } : {};

    // Filter by price
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : Number.MAX_SAFE_INTEGER;
    const priceFilter = { price: { $gte: minPrice, $lte: maxPrice } };

    const query = { ...keyword, ...category, ...priceFilter };
    
    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('traderId', 'name email');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/products
const createProduct = async (req, res) => {
  try {
    const product = new Product({
      traderId: req.user._id,
      title: req.body.title || 'Sample title',
      price: req.body.price || 0,
      description: req.body.description || 'Sample description',
      image: req.body.image || '/images/sample.jpg',
      category: req.body.category || 'Uncategorized',
      stock: req.body.stock || 0
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const { title, price, description, image, category, stock } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      // Ensure only the trader who created it or an admin can update
      if (product.traderId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to update this product' });
      }

      product.title = title || product.title;
      product.price = price || product.price;
      product.description = description || product.description;
      product.image = image || product.image;
      product.category = category || product.category;
      product.stock = stock || product.stock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      if (product.traderId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this product' });
      }
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
