const notificationService = require('../services/notificationService');

const notificationResolvers = {
  Mutation: {
    sendSMS: async (_, { to, body }) => {
      return await notificationService.sendSMS(to, body);
    }
  }
};

module.exports = notificationResolvers;