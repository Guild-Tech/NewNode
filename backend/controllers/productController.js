const { Product } = require('../models/Product');
const { v4: uuidv4 } = require('uuid'); // Import UUID for generating unique IDs

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Get a single product by `id`
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};

// Create a new product with a unique `id`
const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, specs } = req.body;

    if (!name || !description || !price || !image || !specs) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const productId = req.body.id ? Number(req.body.id) : Date.now();

    const newProduct = new Product({
      id: productId,
      name,
      description,
      price,
      image,
      specs,
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
};

// Update an existing product by `id`
const normalizeSpecs = (specs) => ({
  ...specs,
  ram: specs.ram.replace(' RAM', ''), // Remove " RAM" from input
});

const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body, specs: normalizeSpecs(req.body.specs) }, // Normalize specs before updating
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};


// Delete a product by `id`
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ id: req.params.id });
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
