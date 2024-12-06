const Facturapi = require("facturapi").default;

const facturapi = new Facturapi("sk_test_B5oDV0NRv7pn3XGz18AQpbRG76OdyWA4QMxr8gaK2m");

// Crear un producto
async function createProduct(product) {
    try {
        const facturapiProduct = {
            description: product.description,
            product_key: product.clave_producto || "50202306",  // Usar clave_producto si se proporciona, o la predeterminada
            price: product.price,
            sku: product.sku,  // Agregar SKU
            unit_measure: product.unidad_medida || "Pieza",  // Usar unidad_medida si se proporciona, o la predeterminada
        };

        const createdProduct = await facturapi.products.create(facturapiProduct);
        console.log("Producto creado exitosamente:", createdProduct);
        return createdProduct;
    } catch (error) {
        console.error("Error al crear el producto:", error.message);
        throw error;
    }
}


// Actualizar un producto
async function updateProduct(productId, updatedProduct) {
    try {
        // Verificar que el productId esté presente
        if (!productId) {
            throw new Error('El ID del producto es requerido');
        }

        // Preparar los datos para la actualización
        const facturapiProduct = {
            description: updatedProduct.description || '', // Asignar descripción si se pasa
            product_key: updatedProduct.clave_producto || "50202306", // Usar clave_producto si se proporciona, o la predeterminada
            price: updatedProduct.price || 0.0, // Asegurarse de que el precio esté definido
            sku: updatedProduct.sku || '', // Agregar SKU
        };

        // Llamada para actualizar el producto en Facturapi
        const updated = await facturapi.products.update(productId, facturapiProduct);

        // Comprobación de la respuesta de Facturapi
        if (updated && updated.id) {
            console.log("Producto actualizado exitosamente en Facturapi:", updated);
            return updated;
        } else {
            throw new Error('No se pudo actualizar el producto en Facturapi');
        }
    } catch (error) {
        console.error("Error al actualizar el producto:", error.message);
        throw error;
    }
}



// Eliminar un producto
async function deleteProduct(productId) {
    try {
        // Verificar si el producto existe antes de eliminar
        console.log("Verificando producto con ID:", productId);
        const product = await facturapi.products.retrieve(productId);

        if (!product) {
            throw new Error(`Producto con ID ${productId} no encontrado`);
        }

        // Eliminar el producto
        console.log("Intentando eliminar el producto:", product);
        const deleted = await facturapi.products.del(productId);
        console.log("Producto eliminado exitosamente:", deleted);
        return deleted;
    } catch (error) {
        console.error("Error al eliminar el producto:", error.message);
        throw error;
    }
}


module.exports = { createProduct, updateProduct, deleteProduct };
