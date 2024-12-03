const productService = require('../services/productService'); 

const resolvers = {
   Query: {
       products: () => { 
           return productService.getAllProducts(); // Servicio para obtener todos los productos
       }
   },
   Mutation: {
    createProduct: async (_, args) => await productService.createProduct(args),
    updateProduct: async (_, args) => await productService.updateProduct(args),
    deleteProduct: async (_, { _id }) => await productService.deleteProduct(_id),
   }
};

module.exports = resolvers;

  
