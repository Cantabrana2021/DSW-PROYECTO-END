const Facturapi = require("facturapi").default;
const facturapi = new Facturapi("sk_test_B5oDV0NRv7pn3XGz18AQpbRG76OdyWA4QMxr8gaK2m");

const facturapiUser = {
  createUser: async (userData) => {

    const facturapiRequestData = {
      legal_name: userData.name,  
      tax_id: userData.rfc,          
      email: userData.email,      
      password: userData.password, 
      direccion: userData.direccion,
      phone: userData.phone,          
      tax_system: '616', 
      address: { 
        zip: String(userData.zip),
      }
    };

    try {
      return await facturapi.customers.create(facturapiRequestData);
    } catch (error) {
      throw new Error(error.message);  
    }
  },

  updateUser: async (userId, userData) => {
    const facturapiRequestData = {
      legal_name: userData.name,
      email: userData.email,
      phone: userData.phone,
      tax_system: userData.tax_system,   
      address: {                         
        zip: userData.zip,
      }
    };

    try {
      return await facturapi.customers.update(userId, facturapiRequestData);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  deleteUser: async (userId) => {
    try {
      return await facturapi.customers.del(userId);
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

module.exports = facturapiUser;
