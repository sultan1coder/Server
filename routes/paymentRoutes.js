const { default: mongoose } = require("mongoose");
const Payment = require("../models/Payment");
const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    res.status(200).json(await Payment.find());
  } catch (err) {
    res.status(501).json(err);
  }
});
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const allPayments = await Payment.find();
    const payments = await Payment.find({ member: id });
    console.log(id, payments);
    res.status(200).json(payments);
  } catch (err) {
    console.log(err);
    res.status(501).json({ err });
  }
});
router.get("/:memberId/:paymentId", async (req, res) => {
  const { memberId, paymentId } = req.params;
  try {
    const payments = await Payment.getByMember(memberId);
    const payment = payments.filter((p) => p._id.toString() === paymentId);
    if (payment.length !== 0) return res.json(payment);
    throw new Error({ msg: "not found" });
  } catch (err) {
    res.status(500).json(err);
  }
});
router.post("/:id", async (req, res) => {
  const id = req.params.id;
  const payment = req.body;
  payment.member = id;
  try {
    res.status(200).json(await Payment.create(payment));
  } catch (err) {
    console.log(payment);
    console.log(err);
    res.status(401).json({ err });
  }
});

module.exports = router;
