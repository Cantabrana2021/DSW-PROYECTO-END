import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_CLIENTS = gql`
  query GetClients {
    clients {
      id
      nombreCompleto
      email
      direccion
      telefono
      tipoUsuario
      metodoPagoPreferido
    }
  }
`;

const ClientList = () => {
  const { loading, error, data } = useQuery(GET_CLIENTS);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.clients.map(client => (
        <li key={client.id}>
          <h2>{client.nombreCompleto}</h2>
          <p>Email: {client.email}</p>
          <p>Dirección: {client.direccion}</p>
          <p>Teléfono: {client.telefono}</p>
          <p>Tipo de Usuario: {client.tipoUsuario}</p>
          <p>Métodos de Pago Preferidos: {client.metodoPagoPreferido.join(', ')}</p>
        </li>
      ))}
    </ul>
  );
};

export default ClientList;
