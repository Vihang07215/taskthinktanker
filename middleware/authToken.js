const jwt = require("jsonwebtoken");
exports.authtoken = async (req, res, next) => {
  const { token } = req.cookies;
  
  let validate_Token_New;
  if (!token) {
    throw new Error("Token not found!");
  }
  validate_Token_New = jwt.verify(token, process.env.SECRET_KEY);
  if (!validate_Token_New) {
    const error = new ErrorHandler("Login Required !!!", 500);
    return next(error);
  }
  req.userID = validate_Token_New.userID;
  req.email = validate_Token_New.email;


  

  next();
};
