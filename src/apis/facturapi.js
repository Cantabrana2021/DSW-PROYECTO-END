const Facturapi = require("facturapi").default;

const facturapi = new Facturapi("sk_test_B5oDV0NRv7pn3XGz18AQpbRG76OdyWA4QMxr8gaK2m");

// Crear un producto
async function createProduct(product) {
    try {
        const facturapiProduct = {
            description: product.description,
            product_key: "50202306",
            price: product.price,
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
        const facturapiProduct = {
            description: updatedProduct.description,
            product_key: "50202306",
            price: updatedProduct.price,
        };
        const updated = await facturapi.products.update(productId, facturapiProduct);
        console.log("Producto actualizado exitosamente:", updated);
        return updated;
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
