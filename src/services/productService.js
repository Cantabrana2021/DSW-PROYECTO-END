const Product = require('../models/productModel');
const facturapi = require('../apis/facturapi');

const productService = {
  getAllProducts: async () => await Product.find(),

  createProduct: async (args) => {
    const product = new Product(args);
    
    const facturapiproduct = await facturapi.createProduct(product);
    
    product.facturapiid = facturapiproduct.id;
    
    return await product.save();
  },

  updateProduct: async ({ _id, ...rest }) => {
    const product = await Product.findById(_id);
    if (!product) throw new Error('Producto no encontrado');

    if (product.facturapiid) {
      await facturapi.updateProduct(product.facturapiid, {
        description: rest.description || product.description,
        price: rest.price || product.price
      });
    }

    return await Product.findByIdAndUpdate(_id, rest, { new: true });
  },


  deleteProduct: async (_id) => {
    const product = await Product.findById(_id);
    if (!product) throw new Error('Producto no encontrado');

    if (product.facturapiid) {
      await facturapi.deleteProduct(product.facturapiid);
    }

    return await Product.findByIdAndDelete(_id);
  }
};

module.exports = productService;
