const supabase = require('../config/supabaseClient');

// GET /api/products
const getProducts = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    
    let query = supabase.from('products').select('*', { count: 'exact' });

    // Search keyword
    if (req.query.keyword) {
      query = query.ilike('title', `%${req.query.keyword}%`);
    }

    // Filter by category
    if (req.query.category) {
      query = query.eq('category', req.query.category);
    }

    // Filter by price
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : 1000000;
    query = query.gte('price', minPrice).lte('price', maxPrice);

    // Sorting
    const sortBy = req.query.sortBy || 'newest';
    if (sortBy === 'price_asc') {
      query = query.order('price', { ascending: true });
    } else if (sortBy === 'price_desc') {
      query = query.order('price', { ascending: false });
    } else if (sortBy === 'rating_desc') {
      query = query.order('average_rating', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data: products, count, error } = await query
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) throw error;

    // Map fields for frontend compatibility
    const mappedProducts = products.map(p => ({
      ...p,
      _id: p.id,
      traderId: p.trader_id,
      averageRating: p.average_rating || 0,
      reviewCount: p.review_count || 0
    }));

    res.json({ products: mappedProducts, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*, users(name, email)')
      .eq('id', req.params.id)
      .single();

    if (error || !product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Map fields for frontend compatibility
    const mappedProduct = {
      ...product,
      _id: product.id,
      traderId: {
        _id: product.trader_id,
        name: product.users.name,
        email: product.users.email
      }
    };

    res.json(mappedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/products
const createProduct = async (req, res) => {
  try {
    const { title, price, description, image, category, stock } = req.body;
    
    const { data: product, error } = await supabase
      .from('products')
      .insert([{
        trader_id: req.user.id,
        title: title || 'Sample title',
        price: price || 0,
        description: description || 'Sample description',
        image: image || '/images/sample.jpg',
        category: category || 'Uncategorized',
        stock: stock || 0
      }])
      .select()
      .single();

    if (error) throw error;
    
    res.status(201).json({ ...product, _id: product.id, traderId: product.trader_id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const { title, price, description, image, category, stock } = req.body;
    
    // First, check ownership
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('trader_id')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.trader_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    const { data: updatedProduct, error } = await supabase
      .from('products')
      .update({
        title: title || undefined,
        price: price || undefined,
        description: description || undefined,
        image: image || undefined,
        category: category || undefined,
        stock: stock || undefined
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ ...updatedProduct, _id: updatedProduct.id, traderId: updatedProduct.trader_id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('trader_id')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.trader_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
