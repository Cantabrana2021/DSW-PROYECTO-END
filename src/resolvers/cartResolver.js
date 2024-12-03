const cartService = require('../services/cartService');

module.exports = {
  Query: {
    async LeerHistorial(_, { usuario }) {
      try {
        // Verificar si el usuarioId se pasa correctamente
        if (!usuario) throw new Error("Se debe proporcionar un usuario");

        // Llamar al servicio con el usuarioId
        const historiales = await cartService.leerHistorial(usuario);
        return historiales;
      } catch (error) {
        throw new Error(`Error al obtener el historial: ${error.message}`);
      }
    },
    LeerCarrito: async (_, { id_carrito }) => {
      try {
        return await cartService.leerCarrito(id_carrito);
      } catch (error) {
        throw new Error(`Error al obtener el carrito: ${error.message}`);
      }
    },
  },
  Mutation: {
    CrearCarrito: (_, { usuario }) => cartService.crearCarrito(usuario),
    AgregarProd: (_, { id_carrito, id_producto, cantidad }) =>
      cartService.agregarProducto(id_carrito, id_producto, cantidad),
    EliminarProd: (_, { id_carrito, id_producto }) =>
      cartService.eliminarProducto(id_carrito, id_producto),
    CerrarCarrito: (_, { id_carrito }) => cartService.cerrarCarrito(id_carrito),

    
    ReducirCant: (_, { id_carrito, id_producto }) =>
      cartService.reducirCantidadProducto(id_carrito, id_producto),
    ActualizarCant: async (_, { id_carrito, id_producto, cantidad }) => {
      try {
          const carritoActualizado = await cartService.actualizarCantidad(id_carrito, id_producto, cantidad);
          if (!carritoActualizado) {
              throw new Error('No se pudo actualizar el carrito.');
          }
          return carritoActualizado;
      } catch (error) {
          console.error(`Error en resolver ActualizarCant: ${error.message}`);
          throw new Error(error.message);
      }
  }

  },

};
