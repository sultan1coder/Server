const jwt = require("jsonwebtoken");

const authHandler = (req, res, next) => {
  let user;
  const authHeader = req.headers.authorization;
  if (!authHeader) throw Error("401");
  const token = authHeader.split(" ")[1];
  if (!token) throw Error("404");
  else
    jwt.verify(token, "secret", (err, decoded) => {
      if (err) throw Error(err.message);
      else req.user = decoded;
      console.log(req.user);
    });
  next();
};

module.exports = authHandler;
