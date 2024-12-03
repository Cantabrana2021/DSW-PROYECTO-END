const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  id_carrito: { 
    type: mongoose.Schema.Types.ObjectId, 
    default: () => new mongoose.Types.ObjectId(), 
    unique: true 
  },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productos: [
    {
      producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      cantidad: { type: Number, required: true, min: 1 },
      subtotal: { type: Number, required: true }, // cantidad * precio
    },
  ],
  subtotal: { type: Number, default: 0 },
  IVA: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  estatus: { type: String, enum: ['activo', 'inactivo'], default: 'activo' },
  fecha_creacion: { type: Date, default: Date.now },
  fecha_cierre: { type: Date, default: null },
});

CartSchema.set('toJSON', {
  transform: function (doc, ret) {
    // Transformar id_carrito a string
    ret.id_carrito = ret.id_carrito.toString();
    
    // Transformar los ObjectIds de los productos en el carrito
    ret.productos.forEach(prod => {
      if (prod.producto) {
        prod.producto = prod.producto.toString(); // Aseguramos que producto sea un string
      }
    });
    return ret;
  }
});


module.exports = mongoose.model('Cart', CartSchema);
