const { gql } = require('apollo-server');

const typeDefs = gql`
enum Category {
  ELECTRONICS
  CLOTHING
  FOOD
  TOYS
}
  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    category: Category!
    brand: String!
    stock: Int!
    imgs: [String!]
  }

  type CartProduct {
    producto: Product!
    cantidad: Int!
    subtotal: Float!
  }
  


  type Cart {
    id_carrito: ID!
    usuario: String!
    productos: [CartProduct!]!
    subtotal: Float!
    IVA: Float!
    total: Float!
    estatus: String!
    fecha_creacion: String!
    fecha_cierre: String
  }

  type Query {
    LeerCarrito(id_carrito: ID!): Cart
    LeerHistorial(usuario: String!): [Cart!]!
  }

  type Mutation {
    CrearCarrito(usuario: String!): Cart!
    AgregarProd(id_carrito: ID!, id_producto: ID!, cantidad: Int!): Cart!
    EliminarProd(id_carrito: ID!, id_producto: ID!): Cart!
    ActualizarCant(id_carrito: ID!, id_producto: ID!, cantidad: Int!): Cart!
    CerrarCarrito(id_carrito: ID!): Cart!
    ReducirCant(id_carrito: ID!, id_producto: ID!): Cart!
  }
`;

module.exports = typeDefs;
