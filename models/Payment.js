const mongoose = require("mongoose");
const Member = require("./Member");
const paymentSchema = new mongoose.Schema(
  {
    amount: {
      type: mongoose.SchemaTypes.Decimal128,
      required: true,
      get: (v) => parseFloat(v), // Convert Decimal128 to number
    },
    discount: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0,
      set:(v) => {
        if(isNaN(v)) return 0;
        return v
      } ,
      get: (v) => parseFloat(v),
    },
    type: {
      type: mongoose.SchemaTypes.String,
      enum: ["membership", "oneTime"],
      required: true,
    },
    expiredDate: {
      type: mongoose.SchemaTypes.Date,
      default: () => new Date().setDate(new Date().getDate() + 30),
    },
    member: {
      type: mongoose.SchemaTypes.ObjectId,
      default: null,
      ref: "Member",
    },
    createdBy: {
      type: mongoose.SchemaTypes.Mixed,
      required: true,
    },
    method: {
      type: String,
      enum: [
        "zaad-dollar",
        "edahab-dollar",
        "zaad-cash",
        "edahab-cash",
        "dollar",
        "cash",
        "others",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

paymentSchema.pre("save", function(){
  if(isNaN(this.discount)) this.discount = 0;
})

async function findByMember(memberId) {
  return await this.find({ member: memberId.toString() })
}
paymentSchema.statics.getByMember = async function (memberId) {
  return await findByMember.bind(this)(memberId);
};
paymentSchema.statics.getLatestPayment = async function (memberId) {
  const payments = await findByMember.bind(this)(memberId);
  return payments[payments.length - 1];
};
module.exports = mongoose.model("Payment", paymentSchema);
