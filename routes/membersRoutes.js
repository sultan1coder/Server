const express = require("express");
const authHandler = require("../handlers/authHandling");
const memberControls = require("../controls/membersControl");
const Member = require("../models/Member");
const router = express.Router();

router.get("/", memberControls.getAll);
router.get("/:id", memberControls.getById);
router.post("/", memberControls.post);
router.delete("/:id", memberControls.delete);
router.put("/:id", memberControls.patch);
router.delete("/",async (req,res)=> {
   await Member.deleteMany();
   res.json({msg:"all deleted"});
})
module.exports = router;
