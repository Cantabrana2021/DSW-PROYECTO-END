const { Vonage } = require('@vonage/server-sdk');

const vonage = new Vonage({
  apiKey: 'bc9b93e1',
  apiSecret: 'tYsK79OdTZpeRVmQ'
});

const notificationService = {
  sendSMS: async (to, text) => {
    try {
      const response = await vonage.sms.send({ to, from: 'Tienda Online', text });
      return response;
    } catch (error) {
      throw new Error(`Error al enviar SMS: ${error.message}`);
    }
  }
};

module.exports = notificationService;