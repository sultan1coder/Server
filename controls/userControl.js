const createHttpError = require("http-errors");
const User = require("../models/User");
const userServices = require("../services/userServices");
const authServices = require("../services/authServices");
exports.registerUser = async (req, res) => {
  const { username, password, role, createdBy } = req.body;
  const emptyFields = [];
  if (!username) emptyFields.push(0);
  if (!password) emptyFields.push(1);
  if (!role) emptyFields.push(2);
  if (!createdBy) emptyFields.push(3);

  if (emptyFields.length > 0) {
    res.status(401).json({ error: "some fields are missing" });
    return;
  }
  const user = { username, password, role };
  const createdUser = await userServices.registerUser(user);
  // const createdUser = await User.create(user);
  res.json({ createdUser, user });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(500).json({ msg: "insert the proper credentials" });
    return;
  }
  const user = { username, password };
  const token = await authServices.login(user);
  if (token) res.json({ data: token });
  else res.status(400).json({ msg: "invalid password or username" });
};


exports.getAllUsers = async(req, res)=>{
  try{
    const allusers =  await userServices.getAll();
    res.json({users:allusers})
  }catch(err){
    res.status(501).json({error:true,msg:err.message})
  }
}