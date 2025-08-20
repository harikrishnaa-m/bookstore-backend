const appMiddleware = (req, res, next) => {
  console.log("inside app middleware");
  next(); //pass control to next middleware in the application stack
};

module.exports = appMiddleware;
