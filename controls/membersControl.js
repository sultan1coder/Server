const {
  getAllMembers,
  getMemberById,
  createMember,
  deleteMember,
  updateMebmer,
} = require("../services/memberServices");

exports.getAll = async (req, res) => {
  const members = await getAllMembers();
  const response = members.map((member) => member.toObject());
  res.json(response);
};
exports.getById = async (req, res) => {
  const id = req.params.id || -1;
  if (id === -1) throw Error("not found");
  const member = await getMemberById(req.params.id);
  const response = member.toObject();
  res.json(response);
};
exports.post = async (req, res) => {
  const data = req.body;
  try {
    if (Object.getOwnPropertyNames(data).length === 0)
      throw Error("no property");
    res.json(await createMember(data));
  } catch (err) {
    res.status(501).json({ msg: err.message });
    console.log(err.message);
    console.log(data);
  }
};
exports.delete = async (req, res) => {
  const id = req.params.id || -1;
  if (id === -1) throw Error("not found");
  res.json(await deleteMember(id));
};
exports.patch = async (req, res) => {
  const id = req.params.id || -1;
  const data = req.body;
  if (id === -1) throw Error("not valid member");
  if (Object.getOwnPropertyNames(data).length === 0)
    throw Error("there is no property");
  res.json(await updateMebmer(id, data));
};
