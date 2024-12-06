const productService = require('../services/productService');
const dateScalar = require('../schemas/dateScalar');

const resolvers = {
  Date: dateScalar,
  Query: {
    products: () => {
      return productService.getAllProducts();
    }
  },
  Mutation: {
    createProduct: async (_, args) => await productService.createProduct(args),
    updateProduct: async (_, args) => await productService.updateProduct(args),
    deleteProduct: async (_, { _id }) => await productService.deleteProduct(_id),
  }
};

module.exports = resolvers;
