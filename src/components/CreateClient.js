import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const CREATE_CLIENT = gql`
  mutation CreateClient(
    $nombreCompleto: String!,
    $email: String!,
    $password: String!,
    $direccion: String!,
    $telefono: String!,
    $tipoUsuario: String!,
    $metodoPagoPreferido: [String!]!
  ) {
    CreateClient(
      nombreCompleto: $nombreCompleto,
      email: $email,
      password: $password,
      direccion: $direccion,
      telefono: $telefono,
      tipoUsuario: $tipoUsuario,
      metodoPagoPreferido: $metodoPagoPreferido
    ) {
      id
      nombreCompleto
    }
  }
`;

const CreateClient = () => {
  const [form, setForm] = useState({
    nombreCompleto: '',
    email: '',
    password: '',
    direccion: '',
    telefono: '',
    tipoUsuario: 'cliente',
    metodoPagoPreferido: [],
  });

  const [createClient] = useMutation(CREATE_CLIENT);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleMethodChange = (e) => {
    const { value } = e.target;
    setForm({ ...form, metodoPagoPreferido: value.split(',').map(method => method.trim()) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createClient({ variables: form });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="nombreCompleto" placeholder="Nombre Completo" onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required />
      <input name="direccion" placeholder="Dirección" onChange={handleChange} required />
      <input name="telefono" placeholder="Teléfono" onChange={handleChange} required />
      <select name="tipoUsuario" onChange={handleChange} required>
        <option value="cliente">Cliente</option>
        <option value="admin">Admin</option>
      </select>
      <input 
        name="metodoPagoPreferido" 
        placeholder="Métodos de Pago (separados por comas)" 
        onChange={handleMethodChange} 
        required 
      />
      <button type="submit">Crear Cliente</button>
    </form>
  );
};

export default CreateClient;
