const User = require("../models/User");

exports.registerUser = async (user) => {
  try {
    createdUser = await User.create(user);
    return createdUser;
  } catch (err) {
    return err;
  }
};
exports.loginUser = async (user) => {
  try {
    const loggedUser = await User.findOne({ username: user.username });
    if (loggedUser) {
      if (await bcrypt.compare(user.password, loggedUser.password)) {
        const token = jwt.sign(loggedUser.toObject(), "secret");
        return token;
      }
    }
  } catch (err) {
    console.log(err);
    // for production
  }
};

exports.getAll = async()=>{
  try{
    return await User.find().populate("createdBy");
  }catch(err){
    return err;
  }
}