const mongoose = require('mongoose');

// esquema del producto en MongoDB
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },           // nombre del producto
    description: String,    // descripción del producto
    price: { 
        type: Number, 
        required: true, 
        min: [0.01, 'El precio debe ser mayor a 0']   // precio debe ser mayor a 0
    },
    category: { 
        type: String, 
        required: true, 
        enum: ['ELECTRONICS', 'CLOTHING', 'FOOD', 'TOYS'],       // categoría restringida
    },
    brand: { type: String, required: true },          // marca del producto
    stock: { type: Number, default: 0, min: 0 },      // stock con valor por defecto de 0
    createAt: { type: Date, default: Date.now },      // fecha de creación por defecto
    imgs: { type: [String], default: [] },             // URLs de imágenes del producto
    facturapiid: {type: String, required: true}
});

// Evita la redefinición del modelo si ya existe
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product;


