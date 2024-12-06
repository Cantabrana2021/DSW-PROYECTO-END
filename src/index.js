// src/index.js
const { ApolloServer } = require('apollo-server');
const connectDB = require('./db/mongo');

const productTypeDefs = require('./schemas/productSchema');
const productResolvers = require('./resolvers/productResolver');
const clientTypeDefs = require('./schemas/clientSchema');
const clientResolvers = require('./resolvers/clientResolver');
const cartTypeDefs = require('./schemas/cartSchema');
const cartResolvers = require('./resolvers/cartResolver');
global.XMLHttpRequest = require('xhr2');
const startServer = async () => {
  await connectDB(); // Conectar a MongoDB
  const typeDefs = [productTypeDefs, clientTypeDefs, cartTypeDefs];
  const resolvers = [productResolvers, clientResolvers, cartResolvers];

  const server = new ApolloServer({ typeDefs, resolvers });

  server.listen({ port: 4000 }).then(({ url }) => {
    console.log(`Servidor corriendo en ${url}`);
  });
};

startServer();
