const { gql } = require('apollo-server');

const typeDefs = gql`
  enum Category {
    ELECTRONICS
    CLOTHING
    FOOD
    TOYS
  }

  type Product {
    _id: ID!
    name: String!
    description: String!
    price: Float!
    category: Category!
    brand: String!
    stock: Int!
    creationDate: String
    imgs: [String]
    facturapiid: String
    sku: String  
    clave_producto: String 
    unidad_medida: String  
  }

  type Query {
    products: [Product]
  }

  type Mutation {
    createProduct(
      name: String!,
      description: String,
      price: Float!,
      category: Category,
      brand: String,
      creationDate: String,
      stock: Int,
      imgs: [String],
      facturapiid: String,
      sku: String,
      clave_producto: String,
      unidad_medida: String
    ): Product

    updateProduct(
      _id: ID!,
      name: String,
      description: String,
      price: Float,
      category: Category,
      brand: String,
      stock: Int,
      imgs: [String],
      facturapiid: String,
      sku: String,
      clave_producto: String,
    ): Product

    deleteProduct(_id: ID!): Product
  }
`;

module.exports = typeDefs;