module.exports = function rolehandler(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) next(new Error("401"));
    if (roles.includes("user")) {
      if (req.params.id != req.user.id)
        next(new Error("you are not authorized to access other accounts"));
      else next();
    } else next();
  };
};
