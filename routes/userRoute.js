const express = require("express");
const routes = express.Router();
const { signup, login ,editprofile,profile,resetpassword,forgotpassword} = require("../controller/userController");
const {authtoken} = require("../middleware/authToken");
const { body, validationResult } = require("express-validator");
const {upload}= require("../middleware/imageupload");

routes.post(
  "/register",
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  signup
);

routes.post(
  "/login",
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  login
);

routes.put("/edit-profile/:userId",
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  authtoken,
  editprofile
);


routes.get("/profile", authtoken, profile);
routes.post('/forgot-password', forgotpassword);
routes.post('/reset-password/:userId',authtoken, resetpassword);

module.exports = routes; 

