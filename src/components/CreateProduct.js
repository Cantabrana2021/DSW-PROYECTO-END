import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const CREATE_PRODUCT = gql`
  mutation CreateProduct($name: String!, $description: String!, $price: Float!, $category: String!, $brand: String!, $stock: Int!, $imgs: [String!]) {
    CreateProduct(name: $name, description: $description, price: $price, category: $category, brand: $brand, stock: $stock, imgs: $imgs) {
      id
      name
    }
  }
`;

const CreateProduct = () => {
  const [form, setForm] = useState({ name: '', description: '', price: 0, category: '', brand: '', stock: 0, imgs: [] });
  const [createProduct] = useMutation(CREATE_PRODUCT);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ 
      ...form, 
      [name]: 
        name === 'price' ? Math.max(0, parseFloat(value)) 
        : name === 'stock' ? parseInt(value, 10) 
        : value 
    });
  };

  const handleImageChange = (e) => {
    const { value } = e.target;
    setForm({ ...form, imgs: value.split(',').map(img => img.trim()) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createProduct({ variables: { ...form, price: parseFloat(form.price), stock: parseInt(form.stock, 10) } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Nombre" onChange={handleChange} required />
      <textarea name="description" placeholder="Descripción" onChange={handleChange} required />
      <input 
        name="price" 
        type="number" 
        step="0.01" 
        placeholder="Precio" 
        onChange={handleChange} 
        required 
        min="0.01" 
        value={form.price > 0 ? form.price : ''} // Asegura que el precio sea mayor a 0
      />
      <select name="category" onChange={handleChange} required>
        <option value="">Seleccione una Categoría</option>
        <option value="frutas y verduras">Frutas y Verduras</option>
        <option value="lacteos">Lácteos</option>
      </select>
      <input name="brand" placeholder="Marca" onChange={handleChange} required />
      <input 
        name="stock" 
        type="number" 
        placeholder="Stock" 
        onChange={handleChange} 
        required 
        min="0" 
        value={form.stock >= 0 ? form.stock : 0} // Valor por defecto 0
      />
      <input 
        name="imgs" 
        placeholder="URLs de Imágenes (separadas por comas)" 
        onChange={handleImageChange} 
      />
      <button type="submit">Crear Producto</button>
    </form>
  );
};

export default CreateProduct;

