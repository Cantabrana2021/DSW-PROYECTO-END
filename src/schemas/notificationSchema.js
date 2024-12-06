const { gql } = require('apollo-server');

const typeDefs = gql`
  type Message {
    sid: String!
    status: String!
    body: String!
  }

  type Mutation {
    sendSMS(to: String!, body: String!): Message!
  }
`;

module.exports = typeDefs;