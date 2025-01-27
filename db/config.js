require("dotenv").config();
const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};
mongoose.set("toJSON", { getters: true });
mongoose.set("toObject", { getters: true });
async function connect() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (err) {
    console.log(err.message);
  } finally {
    // Ensures that the client will close when you finish/error
    // await mongoose.disconnect();
  }
}

module.exports = connect;
