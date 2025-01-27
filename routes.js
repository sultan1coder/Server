"use strict";
const simple = require("./handlers/simple");
const configured = require("./handlers/configured");
const userRouter = require("./routes/userRoutes");
const membersRoutes = require("./routes/membersRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

module.exports = function (app, opts) {
  // Setup routes, middleware, and handlers
  app.use("/configuration/users", userRouter);
  app.use("/members", membersRoutes);
  app.use("/payments",paymentRoutes)
  app.get("/configured", configured(opts));
};
