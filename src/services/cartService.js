const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const mongoose = require('mongoose');

module.exports = {
  async crearCarrito(usuarioId) {
    try {
      const nuevoCarrito = new Cart({
        usuario: usuarioId,
        productos: [],
        subtotal: 0,
        IVA: 0,
        total: 0,
        estatus: 'activo',
        fecha_cierre: null,
      });

      return await nuevoCarrito.save();
    } catch (error) {
      throw new Error(`Error al crear el carrito: ${error.message}`);
    }
  },

  async agregarProducto(id_carrito, id_producto, cantidad) {
    try {
      const carrito = await Cart.findOne({ id_carrito });
      if (!carrito || carrito.estatus !== 'activo') {
        throw new Error('Carrito no encontrado o inactivo.');
      }
  
      const producto = await Product.findById(id_producto);
      if (!producto) {
        throw new Error('Producto no encontrado.');
      }
      if (producto.stock < cantidad) {
        throw new Error('Stock insuficiente.');
      }
  
      const prodIndex = carrito.productos.findIndex((p) => p.producto.toString() === id_producto);
      if (prodIndex >= 0) {
        // Actualizar cantidad y subtotal si el producto ya está en el carrito
        carrito.productos[prodIndex].cantidad += cantidad;
        carrito.productos[prodIndex].subtotal += cantidad * producto.price;
      } else {
        // Agregar un nuevo producto al carrito
        carrito.productos.push({
          producto: id_producto,
          cantidad,
          subtotal: cantidad * producto.price,
        });
      }
  
      // Recalcular totales del carrito
      carrito.subtotal = carrito.productos.reduce((acc, p) => acc + p.subtotal, 0);
      carrito.IVA = carrito.subtotal * 0.16;
      carrito.total = carrito.subtotal + carrito.IVA;
  
      // Guardar cambios
      return await carrito.save();
    } catch (error) {
      console.error(`Error en agregarProducto: ${error.message}`);
      throw new Error(`Error al agregar producto: ${error.message}`);
    }
  },
  async eliminarProducto(id_carrito, id_producto) {
    try {
      const carrito = await Cart.findOne({ id_carrito }).populate('productos.producto');
      if (!carrito || carrito.estatus !== 'activo') throw new Error('Carrito no encontrado o inactivo.');
  
      // Verificar si el producto está en el carrito
      const prodIndex = carrito.productos.findIndex(p => p.producto._id.toString() === id_producto);
      if (prodIndex === -1) throw new Error('Producto no encontrado en el carrito.');
  
      // Eliminar producto del carrito
      carrito.productos.splice(prodIndex, 1);
  
      // Recalcular totales
      carrito.subtotal = carrito.productos.reduce((acc, p) => acc + p.subtotal, 0);
      carrito.IVA = carrito.subtotal * 0.16;
      carrito.total = carrito.subtotal + carrito.IVA;
  
      return await carrito.save();
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  },
  
  async cerrarCarrito(id_carrito) {
    try {
      // Intentar encontrar el carrito en la base de datos
      const carrito = await Cart.findOne({ id_carrito }).populate('productos.producto');
      
      // Si no se encuentra el carrito o su estatus no es 'activo', lanzar un error
      if (!carrito) {
        console.log(`Carrito con ID ${id_carrito} no encontrado`);
        throw new Error('Carrito no encontrado.');
      }
  
      if (carrito.estatus !== 'activo') {
        console.log(`Carrito con ID ${id_carrito} ya está inactivo`);
        throw new Error('Carrito ya está inactivo.');
      }
  
      // Si todo está bien, proceder con el cierre del carrito y actualización del stock
      for (const item of carrito.productos) {
        const producto = await Product.findById(item.producto);
        
        if (!producto) {
          throw new Error(`Producto con ID ${item.producto} no encontrado.`);
        }
        
        // Verificar si hay suficiente stock
        if (producto.stock < item.cantidad) {
          throw new Error(`Stock insuficiente para el producto ${producto.nombre}.`);
        }
  
        // Restar la cantidad vendida del stock
        producto.stock -= item.cantidad;
        await producto.save();
        
        console.log(`Se ha vendido ${item.cantidad} del producto ${producto.nombre}. Nuevo stock: ${producto.stock}`);
      }
  
      // Cambiar el estatus del carrito a inactivo
      carrito.estatus = 'inactivo';
      carrito.fecha_cierre = new Date();
  
      // Guardar el carrito con los cambios
      await carrito.save();
      
      console.log(`Carrito con ID ${id_carrito} cerrado correctamente.`);
      return carrito;
    } catch (error) {
      console.error(`Error al cerrar el carrito: ${error.message}`);
      throw new Error(`Error al cerrar el carrito: ${error.message}`);
    }
  },
  

  async leerCarrito(id_carrito) {
  try {
    
    const carrito = await Cart.findOne({ id_carrito }).populate('productos.producto');
    if (!carrito) throw new Error('Carrito no encontrado.');

    return carrito;
  } catch (error) {
    throw new Error(`Error al leer el carrito: ${error.message}`);
  }
},
async leerHistorial(usuario) {
  try {
    const historiales = await Cart.find({ usuario }).populate('productos.producto');
    if (!historiales || historiales.length === 0) {
      throw new Error('No se encontraron historiales para este usuario.');
    }
    return historiales;
  } catch (error) {
    throw new Error(`Error al obtener el historial: ${error.message}`);
  }
},
async LeerHistorial(_, { usuario }) {
  console.log("usuario recibido:", usuario); // Verifica que el id sea correcto
  try {
    if (!usuario) throw new Error("Se debe proporcionar un usuario");

    const historiales = await cartService.leerHistorial(usuario);
    return historiales;
  } catch (error) {
    throw new Error(`Error al obtener el historial: ${error.message}`);
  }
},

async reducirCantidadProducto(id_carrito, id_producto) {
  try {
    const carrito = await Cart.findOne({ id_carrito }).populate('productos.producto');
    if (!carrito || carrito.estatus !== 'activo') throw new Error('Carrito no encontrado o inactivo.');

    // Verificar si el producto está en el carrito
    const prodIndex = carrito.productos.findIndex(p => p.producto._id.toString() === id_producto);
    if (prodIndex === -1) throw new Error('Producto no encontrado en el carrito.');

    // Reducir la cantidad del producto
    if (carrito.productos[prodIndex].cantidad > 1) {
      carrito.productos[prodIndex].cantidad -= 1;
      carrito.productos[prodIndex].subtotal -= carrito.productos[prodIndex].producto.price;
    } else {
      // Si la cantidad es 1, eliminar el producto del carrito
      carrito.productos.splice(prodIndex, 1);
    }

    // Recalcular totales
    carrito.subtotal = carrito.productos.reduce((acc, p) => acc + p.subtotal, 0);
    carrito.IVA = carrito.subtotal * 0.16;
    carrito.total = carrito.subtotal + carrito.IVA;

    return await carrito.save();
  } catch (error) {
    throw new Error(`Error al reducir cantidad del producto:" ${error.message}`);
  }
},
async actualizarCantidad(id_carrito, id_producto, cantidad) {
  try {
      // Buscar el carrito por ID
      const carrito = await Cart.findOne({ id_carrito }).populate('productos.producto');
      if (!carrito || carrito.estatus !== 'activo') {
          throw new Error('Carrito no encontrado o inactivo.');
      }

      // Buscar el producto en la base de datos
      const producto = await Product.findById(id_producto);
      if (!producto) {
          throw new Error('Producto no encontrado.');
      }

      // Verificar si la cantidad deseada no excede el stock disponible
      if (cantidad > producto.stock) {
          throw new Error(`La cantidad solicitada excede el stock disponible de ${producto.stock}.`);
      }

      // Verificar si el producto está en el carrito
      const prodIndex = carrito.productos.findIndex(p => p.producto._id.toString() === id_producto);
      if (prodIndex === -1) {
          throw new Error('Producto no encontrado en el carrito.');
      }

      // Actualizar la cantidad y recalcular el subtotal del producto
      carrito.productos[prodIndex].cantidad = cantidad;
      carrito.productos[prodIndex].subtotal = cantidad * producto.price;

      // Recalcular los totales del carrito
      carrito.subtotal = carrito.productos.reduce((acc, p) => acc + p.subtotal, 0);
      carrito.IVA = carrito.subtotal * 0.16;
      carrito.total = carrito.subtotal + carrito.IVA;

      // Guardar los cambios en el carrito
      return await carrito.save();
  } catch (error) {
      console.error(`Error en actualizarCantidad: ${error.message}`);
      throw new Error(`Error al actualizar la cantidad: ${error.message}`);
  }
},
async actualizarCant(id_carrito, id_producto, cantidad) {
  try {
      console.log(`Actualizando cantidad: ${cantidad} para producto ${id_producto} en carrito ${id_carrito}`);
      
      // Buscar el carrito correspondiente
      const carrito = await Cart.findOne({ id_carrito }).populate('productos.producto');
      if (!carrito) {
          console.error('Carrito no encontrado.');
          return null;
      }

      // Buscar el producto correspondiente
      const producto = await Product.findById(id_producto);
      if (!producto) {
          console.error('Producto no encontrado.');
          return null;
      }

      // Validar que la cantidad no exceda el stock disponible
      if (cantidad > producto.stock) {
          console.error('Cantidad excede el stock disponible.');
          return null;
      }

      // Buscar el índice del producto dentro del carrito
      const prodIndex = carrito.productos.findIndex(p => p.producto._id.toString() === id_producto);
      if (prodIndex === -1) {
          console.error('Producto no encontrado en el carrito.');
          return null;
      }

      // Actualizar la cantidad y el subtotal del producto en el carrito
      carrito.productos[prodIndex].cantidad = cantidad;
      carrito.productos[prodIndex].subtotal = cantidad * producto.price;

      // Recalcular el subtotal, IVA y total del carrito
      carrito.subtotal = carrito.productos.reduce((acc, p) => acc + p.subtotal, 0);
      carrito.IVA = carrito.subtotal * 0.16;
      carrito.total = carrito.subtotal + carrito.IVA;

      console.log('Carrito actualizado correctamente.');
      return await carrito.save();
  } catch (error) {
      console.error(`Error en actualizarCantidad: ${error.message}`);
      throw new Error(`Error al actualizar la cantidad: ${error.message}`);
  }
}


};

