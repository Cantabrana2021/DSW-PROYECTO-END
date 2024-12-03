const User = require('../models/clientModel');
const facturapiUser = require('../apis/facturapiUser');

const userService = {
  getUsers: async () => await User.find(),

  createUser: async (args) => {
    const user = new User(args);
    const facturapiUserResponse = await facturapiUser.createUser({
      name: args.name,
      email: args.email,
      rfc: args.rfc,
      address: args.direccion,
      zip: args.zip,
      phone: args.tel
    });

    user.facturapiId = facturapiUserResponse.id;

    return await user.save();
  },

  updateUser: async ({ _id, ...rest }) => {
    const user = await User.findById(_id);
    if (!user) throw new Error('Usuario no encontrado');

    if (user.facturapiId) {
      await facturapiUser.updateUser(user.facturapiId, {
        name: rest.name || user.name,
        email: rest.email || user.email,
        rfc: rest.rfc || user.rfc,
        address: rest.direccion || user.direccion,
        zip: rest.zip || user.zip,
        phone: rest.tel || user.tel
      });
    }

 const updatedUser = await User.findByIdAndUpdate(_id, rest, { new: true });
    
 if (rest.direccion) {
   updatedUser.direccion = rest.direccion;
   updatedUser.zip = rest.zip;  
   await updatedUser.save();
 }

 return updatedUser;
  },

  deleteUser: async (_id) => {
    const user = await User.findById(_id);
    if (!user) throw new Error('Usuario no encontrado');

    if (user.facturapiId) {
      await facturapiUser.deleteUser(user.facturapiId);
    }

    return await User.findByIdAndDelete(_id);
  }
};

module.exports = userService;
