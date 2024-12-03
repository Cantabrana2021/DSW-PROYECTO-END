const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  facturapiId: { type: String, required: true },
  rfc: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // La contraseña debe ser "hasheada"
  direccion: { type: String, required: true },
  zip: { type: String, required: true },
  tel: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  role: { type: String, required: true },
  payMethod: { type: String, required: true },

});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;

