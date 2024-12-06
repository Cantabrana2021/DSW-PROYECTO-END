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
    // Buscar el producto en la base de datos local
    const product = await Product.findById(_id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    // Validar los campos antes de enviar a Facturapi
    if (!rest.sku) {
      throw new Error('El campo "sku" es obligatorio');
    }
    
    if (!rest.description) {
      rest.description = product.description; // Usar la descripción actual si no se proporciona una nueva
    }
    if (!rest.price) {
      rest.price = product.price; // Usar el precio actual si no se proporciona uno nuevo
    }

    // Verificar si el producto tiene un facturapiid (ID de Facturapi)
    if (product.facturapiid) {
      try {
        // Si tiene facturapiid, actualizar el producto en Facturapi
        const updatedFacturapiProduct = await facturapi.updateProduct(product.facturapiid, {
          description: rest.description,  // Asegurarse de que siempre haya descripción
          price: rest.price,  // Asegurarse de que siempre haya precio
          unit_measure: rest.unit_measure,  // Asegurarse de que siempre haya unidad de medida
          sku: rest.sku  // Asegurarse de que siempre haya SKU
        });

        console.log('Producto actualizado en Facturapi:', updatedFacturapiProduct);
      } catch (error) {
        console.error('Error al actualizar en Facturapi:', error.message);
        throw new Error('Error al actualizar el producto en Facturapi');
      }
    } else {
      console.log('No se encuentra facturapiid, no se puede actualizar en Facturapi');
    }

    // Actualizar el producto en la base de datos local (MongoDB)
    const updatedProduct = await Product.findByIdAndUpdate(_id, rest, { new: true });

    // Devolver el producto actualizado
    return updatedProduct;
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
