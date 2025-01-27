const mongoose = require("mongoose");
const User = require("../models/User");
const Payment = require("./Payment");
const Member = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstname is required"],
      trim: true,
      minlength: [4, "Username must be at least 4 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    middleName: {
      type: String,
      required: [true, "middlename is required"],
      trim: true,
      minlength: [4, "middlename must be at least 4 characters long"],
      maxlength: [30, "middlename cannot exceed 30 characters"],
    },
    lastName: {
      type: String,
      required: [true, "lastname is required"],
      trim: true,
      minlength: [4, "lastname must be at least 4 characters long"],
      maxlength: [30, "lastname cannot exceed 30 characters"],
    },
    phone: {
      type: String,
      required: [true, "phone is required"],
      unique: [true, "phone must be unique"],
      trim: true,
      minlength: [7, "phone must be at least 7 characters long"],
      maxlength: [10, "phone cannot exceed 10 characters"],
    },
    address: {
      type: String,
      required: [true, "address is required"],
      trim: true,
      minlength: [4, "address must be at least 4 characters long"],
      maxlength: [30, "address cannot exceed 30 characters"],
    },
    middleScale: {
      type: String,
      trim: true,
    },
    weight: {
      type: String,
      trim: true,
    },
    shift: {
      type: String,
      enum: ["Morning", "Afternoon", "Evening"],
      required: [true, "the shift is required"],
    },
    deletedAt: {
      type: mongoose.Schema.Types.Date,
      default: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "the gender is required"],
    },
    createdby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

Member.virtual('latestPayment', {
  ref: 'Payment', // Reference to the Payment model
  localField: '_id', // Field in User schema
  foreignField: 'member', // Field in Payment schema
  justOne: true, // Ensure only one document is returned
  options: { sort: { createdAt: -1 } }, // Sort by date descending to get the latest payment
});
Member.set("toObject", { virtuals: true });
Member.set("toJSON", { virtuals: true });

const autoPopulateCreatedBy = function (next) {
  this.populate("createdby").populate("updatedby").populate("latestPayment") // Populate the `createdBy` field
  next();
};

// Apply middleware for all relevant query operations
Member.pre(/^find/, autoPopulateCreatedBy); // Populate for `find` and `findOne`
Member.pre("findOneAndUpdate", autoPopulateCreatedBy); // Populate for `findOneAndUpdate`
Member.pre("findOneAndDelete", autoPopulateCreatedBy); // Populate for `findOneAndDelete`
Member.pre("findOneAndRemove", autoPopulateCreatedBy); // Populate for `findOneAndRemove`
// Middleware to handle soft delete
const handleSoftDelete = async function (next) {
  // Instead of deleting, update `deletedAt` to `Date.now()`
  next();
};

// Apply `pre` middleware for delete operations
Member.pre("findOneAndDelete", handleSoftDelete);
Member.pre("findByIdAndDelete", handleSoftDelete);
Member.pre("deleteMany", handleSoftDelete);

// Static method for finding all active documents
Member.statics.findActive = async function (filter = {}) {
  const documents = await this.find({ deletedAt: null, ...filter });
  return documents;
};

// Static method for finding one active document
Member.statics.findOneActive = async function (filter = {}) {
  const document = await this.findOne({
    deletedAt: null,
    ...filter,
  });
  return document;
};

// Static method for updating one active document
Member.statics.updateOneActive = async function (
  filter = {},
  update = {},
  options = {}
) {
  return await this.findOneAndUpdate({ deletedAt: null, ...filter }, update, {
    new: true,
    ...options,
  });
};

// Static method for updating multiple active documents
Member.statics.updateManyActive = async function (
  filter = {},
  update = {},
  options = {}
) {
  await this.updateMany({ deletedAt: null, ...filter }, update, options);
  const documents = await this.find(filter);
  return documents;
};

// Static method for deleting one active document (soft delete)
Member.statics.deleteOneActive = async function (filter = {}) {
  return this.findOneAndUpdate(
    { deletedAt: null, ...filter },
    { deletedAt: Date.now() },
    { new: true }
  );
};

// Static method for deleting multiple active documents (soft delete)
Member.statics.deleteManyActive = async function (filter = {}) {
  const documents = await this.find(filter);
  await this.updateMany(
    { deletedAt: null, ...filter },
    { deletedAt: Date.now() }
  );
  return documents;
};

// Static method for creating a document
Member.statics.createActive = async function (data) {
  return await this.create({ deletedAt: null, ...data });
};

module.exports = mongoose.model("Member", Member);
