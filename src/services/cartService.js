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

  async agregarProducto(id_carrito, id_producto, cantidad, clave_producto, sku, unidad_medida) {
    try {
      // Buscar el carrito por ID
      const carrito = await Cart.findOne({ id_carrito });
      if (!carrito || carrito.estatus !== 'activo') {
        throw new Error('Carrito no encontrado o inactivo.');
      }
  
      // Buscar el producto por ID
      const producto = await Product.findById(id_producto);
      if (!producto) {
        throw new Error('Producto no encontrado.');
      }
      if (producto.stock < cantidad) {
        throw new Error('Stock insuficiente.');
      }
  
      // Asignar SKU, Clave del producto y Unidad de medida
      producto.sku = sku || producto.sku;
      producto.clave_producto = clave_producto || producto.clave_producto;
      producto.unidad_medida = unidad_medida || producto.unidad_medida;
  
      // Buscar si el producto ya está en el carrito
      const prodIndex = carrito.productos.findIndex((p) => p.producto.toString() === id_producto);
      if (prodIndex >= 0) {
        // Si ya existe, actualizar la cantidad y el subtotal
        carrito.productos[prodIndex].cantidad += cantidad;
        carrito.productos[prodIndex].subtotal += cantidad * producto.price;
      } else {
        // Si no está en el carrito, agregarlo
        carrito.productos.push({
          producto: id_producto,
          cantidad,
          subtotal: cantidad * producto.price,
          clave_producto: producto.clave_producto, // Agregar clave del producto
          sku: producto.sku, // Agregar SKU
          unidad_medida: producto.unidad_medida // Agregar unidad de medida
        });
      }
  
      // Recalcular los totales del carrito
      carrito.subtotal = carrito.productos.reduce((acc, p) => acc + p.subtotal, 0);
      carrito.IVA = carrito.subtotal * 0.16;
      carrito.total = carrito.subtotal + carrito.IVA;
  
      // Guardar los cambios
      return await carrito.save();
    } catch (error) {
      console.error(`Error en agregarProducto: ${error.message}`);
      throw new Error(`Error al agregar producto: ${error.message}`);
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
      throw new Error(`Error al reducir cantidad del producto: ${error.message}`);
    }
  },
  
  
  
  async actualizarCantidad(id_carrito, id_producto, cantidad) {
    try {
      const carrito = await Cart.findOne({ id_carrito }).populate('productos.producto');
      if (!carrito) {
        throw new Error('Carrito no encontrado.');
      }

      const producto = await Product.findById(id_producto);
      if (!producto) {
        throw new Error('Producto no encontrado.');
      }

      if (cantidad > producto.stock) {
        throw new Error('Cantidad excede el stock disponible.');
      }

      const precioConIVA = producto.price;
      const precioSinIVA = parseFloat((precioConIVA / 1.16).toFixed(2));
      const IVAProducto = parseFloat((precioConIVA - precioSinIVA).toFixed(2));

      const prodIndex = carrito.productos.findIndex((p) => p.producto._id.toString() === id_producto);
      if (prodIndex === -1) {
        throw new Error('Producto no encontrado en el carrito.');
      }

      carrito.productos[prodIndex].cantidad = cantidad;
      carrito.productos[prodIndex].subtotal = parseFloat((cantidad * precioSinIVA).toFixed(2));

      let subtotal = 0;
      let IVA = 0;
      carrito.productos.forEach((item) => {
        subtotal += item.cantidad * precioSinIVA;
        IVA += item.cantidad * IVAProducto;
      });

      carrito.subtotal = parseFloat(subtotal.toFixed(2));
      carrito.IVA = parseFloat(IVA.toFixed(2));
      carrito.total = parseFloat((subtotal + IVA).toFixed(2));

      return await carrito.save();
    } catch (error) {
      console.error(`Error en actualizarCantidad: ${error.message}`);
      throw new Error(`Error al actualizar la cantidad: ${error.message}`);
    }
  },

  async eliminarProducto(id_carrito, id_producto) {
    try {
      const carrito = await Cart.findOne({ id_carrito }).populate('productos.producto');
      if (!carrito || carrito.estatus !== 'activo') {
        throw new Error('Carrito no encontrado o inactivo.');
      }

      const prodIndex = carrito.productos.findIndex((p) => p.producto._id.toString() === id_producto);
      if (prodIndex === -1) {
        throw new Error('Producto no encontrado en el carrito.');
      }

      carrito.productos.splice(prodIndex, 1);

      let subtotal = 0;
      let IVA = 0;
      carrito.productos.forEach((item) => {
        const precioConIVA = item.producto.price;
        const precioSinIVA = parseFloat((precioConIVA / 1.16).toFixed(2));
        const IVAProducto = parseFloat((precioConIVA - precioSinIVA).toFixed(2));

        subtotal += item.cantidad * precioSinIVA;
        IVA += item.cantidad * IVAProducto;
      });

      carrito.subtotal = parseFloat(subtotal.toFixed(2));
      carrito.IVA = parseFloat(IVA.toFixed(2));
      carrito.total = parseFloat((subtotal + IVA).toFixed(2));

      return await carrito.save();
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  },
  async cerrarCarrito(id_carrito) {
    try {
      // Buscar el carrito en la base de datos
      const carrito = await Cart.findOne({ id_carrito }).populate('productos.producto');
      if (!carrito) throw new Error('Carrito no encontrado.');
      if (carrito.estatus !== 'activo') throw new Error('Carrito ya está inactivo.');
  
      // Iterar sobre los productos para validar y actualizar stock
      for (const item of carrito.productos) {
        const producto = await Product.findById(item.producto._id);
        if (!producto) {
          throw new Error(`Producto con ID ${item.producto._id} no encontrado.`);
        }
  
        // Verificar que haya suficiente stock
        if (producto.stock < item.cantidad) {
          throw new Error(`Stock insuficiente para el producto ${producto.nombre}.`);
        }
  
        // Reducir el stock del producto
        producto.stock -= item.cantidad;
        await producto.save();
  
        console.log(`Producto: ${producto.nombre}, Cantidad Vendida: ${item.cantidad}, Nuevo Stock: ${producto.stock}`);
      }
  
      // Calcular totales nuevamente antes de cerrar el carrito
      let subtotal = 0;
      let IVA = 0;
  
      carrito.productos.forEach((item) => {
        const precioConIVA = item.producto.price;
        const precioSinIVA = parseFloat((precioConIVA / 1.16).toFixed(2));
        const IVAProducto = parseFloat((precioConIVA - precioSinIVA).toFixed(2));
  
        subtotal += item.cantidad * precioSinIVA;
        IVA += item.cantidad * IVAProducto;
      });
  
      carrito.subtotal = parseFloat(subtotal.toFixed(2));
      carrito.IVA = parseFloat(IVA.toFixed(2));
      carrito.total = parseFloat((subtotal + IVA).toFixed(2));
  
      // Cambiar el estatus del carrito a "inactivo" y establecer la fecha de cierre
      carrito.estatus = 'inactivo';
      carrito.fecha_cierre = new Date();
  
      // Guardar el carrito actualizado
      await carrito.save();
  
      console.log(`Carrito cerrado correctamente: ID ${id_carrito}`);
      return carrito;
    } catch (error) {
      console.error(`Error al cerrar el carrito: ${error.message}`);
      throw new Error(`Error al cerrar el carrito: ${error.message}`);
    }
  },
  async leerCarrito(id_carrito) {
    try {
      // Buscar el carrito en la base de datos
      const carrito = await Cart.findOne({ id_carrito }).populate('productos.producto');
      if (!carrito) throw new Error('Carrito no encontrado.');
  
      // Recalcular subtotales, IVA y total para asegurarse de que los datos sean correctos
      let subtotal = 0;
      let IVA = 0;
  
      carrito.productos.forEach((item) => {
        const precioConIVA = item.producto.price;
        const precioSinIVA = parseFloat((precioConIVA / 1.16).toFixed(2));
        const IVAProducto = parseFloat((precioConIVA - precioSinIVA).toFixed(2));
  
        subtotal += item.cantidad * precioSinIVA;
        IVA += item.cantidad * IVAProducto;
  
        // Actualizar el subtotal de cada producto individualmente
        item.subtotal = parseFloat((item.cantidad * precioSinIVA).toFixed(2));
      });
  
      // Actualizar los totales en el carrito
      carrito.subtotal = parseFloat(subtotal.toFixed(2));
      carrito.IVA = parseFloat(IVA.toFixed(2));
      carrito.total = parseFloat((subtotal + IVA).toFixed(2));
  
      return carrito;
    } catch (error) {
      console.error(`Error al leer el carrito: ${error.message}`);
      throw new Error(`Error al leer el carrito: ${error.message}`);
    }
  },
  async leerHistorial(usuario) {
    try {
      // Buscar los carritos del usuario
      const historiales = await Cart.find({ usuario }).populate('productos.producto');
      
      if (!historiales || historiales.length === 0) {
        throw new Error('No se encontraron historiales para este usuario.');
      }
  
      // Recalcular los totales en cada carrito para garantizar los datos correctos
      const historialCalculado = historiales.map(carrito => {
        let subtotal = 0;
        let IVA = 0;
  
        // Calcular subtotal e IVA de los productos
        carrito.productos.forEach(item => {
          const price = item.producto.price;
          const cantidad = item.cantidad;
  
          const subtotalProducto = (price / 1.16) * cantidad; // Precio sin IVA
          const IVAProducto = (price - price / 1.16) * cantidad; // IVA por producto
  
          subtotal += subtotalProducto;
          IVA += IVAProducto;
        });
  
        // Actualizar los totales del carrito
        carrito.subtotal = parseFloat(subtotal.toFixed(2));
        carrito.IVA = parseFloat(IVA.toFixed(2));
        carrito.total = parseFloat((subtotal + IVA).toFixed(2));
  
        return carrito;
      });
  
      return historialCalculado;
    } catch (error) {
      console.error(`Error al obtener el historial: ${error.message}`);
      throw new Error(`Error al obtener el historial: ${error.message}`);
    }
  }
  
  
  
};
