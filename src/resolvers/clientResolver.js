const clientService = require('../services/clientService');

const userResolvers = {
  Query: {
    users: async () => {

      return await clientService.getUsers();
    },
  },
  Mutation: {
    createUser: async (_, args) => await clientService.createUser(args),
    updateUser: async (_, args) => await clientService.updateUser(args),
    deleteUser: async (_, { _id }) => await clientService.deleteUser(_id),
  },
};

module.exports = userResolvers;