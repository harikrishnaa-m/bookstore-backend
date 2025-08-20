const jwt = require("jsonwebtoken");

const jwtMiddleware = (req, res, next) => {
  console.log("inside jwt middleware");
  console.log(req.headers.authorization.slice(7));
  let token = req.headers.authorization.slice(7);
  try {
    //token verification
    const tokenVerify = jwt.verify(token, "superkey2025");
    req.payload = tokenVerify;
    console.log(tokenVerify);
  } catch (err) {
    res.status(401).json("Authorization Failed...");
  }
  next();
};

module.exports = jwtMiddleware;
