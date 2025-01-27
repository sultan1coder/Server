const memberModel = require("../models/Member");

exports.getAllMembers = async () => {
  return await memberModel.findActive();
};

exports.getMemberById = async (id) => {
  return await memberModel.findOneActive({ _id: id });
};

exports.createMember = async (memberData) => {
  return await memberModel.createActive(memberData);
};

exports.updateMebmer = async (id, updatedData) => {
  return await memberModel.updateOneActive({ _id: id }, updatedData);
};
exports.deleteMember = async (id) => {
  return await memberModel.deleteOneActive({ _id: id });
};
