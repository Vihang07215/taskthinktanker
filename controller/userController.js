const { v4: uuidv4 } = require("uuid");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

 const signup = async (req, res ,next) => {
  const { name, email, password } = req.body;
  let rows;
  let userId = uuidv4();
  const pool = req.pool;
  let user_list;
  hashepassword = await bcrypt.hash(password, 10);
  const fileName = req.file ? req.file.filename : null;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    user_list = rows[0];
  } catch (error) {
    console.error("Error during finging email:", error);
    return next(error);
  }

  if (user_list) {
    return res.status(400).json({ message: "Email already exists" });
  } else {
    let createdUser;
    try {
      [rows] = await pool.query(
        "INSERT INTO users (name, email, password,userId,filename) VALUES (?, ?, ?, ?,?)",
        [name, email, hashepassword, userId, fileName]
      );
      [rows] = await pool.query("SELECT * FROM users WHERE userId = ?", [
        userId,
      ]);
      const createdUser = rows[0];
    } catch (error) {
      console.error("Error during user creation:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};
const login = async (req, res ,next) => {
  const { email, password } = req.body;
  const pool = req.pool;
  let rows;
  let user_list;
  try {
    [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    user_list = rows[0];
  } catch (error) {
    console.error("Error during finding email:", error);
    return res.status(500).json({ message: "Internal server error" });
  }

  if (!user_list) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  try {
    const isMatch = await bcrypt.compare(password, user_list.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    let var_payload = {
      userId: "",
      email: "",
    };

    var_payload.userId = user_list.userId;
    var_payload.email = user_list.email;
    const Token = jwt.sign(var_payload, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    let cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 1 * 21 * 60 * 60 * 1000),
    };
    res.cookie("token", Token, cookieOptions);
    res.json({ Message: "Logged in successfully!!", Token: Token });
  } catch (error) {
    console.error("Error during password comparison:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

 const editprofile = async (req, res ,next) => {
  const { name, email } = req.body;
  const { userId } = req.params;
  const pool = req.pool;
  let rows;
  let user_list;
  const fileName = req.file ? req.file.filename : null;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    [rows] = await pool.query("SELECT email FROM users WHERE userId = ?", [
      userId,
    ]);
    user_list = rows[0];
  } catch (error) {
    console.error("Error during finding user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
  if (email == user_list.email) {
    return res.status(400).json({ message: "Enter Email is already exists" });
  } else {
    try {
      [rows] = await pool.query(
        "UPDATE users SET name = ?, email = ?, filename = ? WHERE userId = ?",
        [name, email, fileName, userId]
      );
      return res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error during profile update:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

const profile = async (req, res) => {
  const pool = req.pool;
  let user_profile;

  let rows;
  try {
    [rows] = await pool.query("SELECT * FROM users");
    user_profile = rows[0];
  } catch (error) {
    console.error("Error during fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.status(200).json({
    user_profile: user_profile,
  });
};

 const forgotpassword = async (req, res, next) => {
    const{  email} = req.body;
    const pool = req.pool;  
    let rows;
    let user_list;
    try{
        [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        user_list = rows[0];
    }
    catch(error){
        console.error("Error during finding email:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
    if(!user_list){
        return res.status(400).json({ message: "Email not found" });
    }
    else{
        let mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Password Reset Link",
            text: `Click on the link to reset your password:`
        };
        try{
           const sendMail= await transporter.sendMail(mailOptions);
            return res.status(200).json({ message: "Password reset link sent to your email" });
        }
        catch(error){
            console.error("Error during sending email:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}




const resetpassword = async(req,res,next)=>{
    const{userId} = req.params;
    const {token,newPassword} = req.body;
    const pool = req.pool;
    let user_list;
    let rows;
    token = req.cookies.token;
    if(!token) {
        return res.status(401).json({ message: "Unauthorized token" });
    }   
    try{
        [rows] = await pool.query("SELECT password FROM users WHERE userId = ?", [userId]);
        user_list = rows[0];
    }
    catch(error){
        console.error("Error during getting password ", error);
    }
   let compasrepassword = await bcrypt.compare(newPassword, user_list.password);
   if(compasrepassword){
        return res.status(400).json({ message: "New password cannot be same as old password" });
    }
    else{
    try{
        [rows] = await pool.query(`UPDATE users SET password = ? WHERE userId = ?`, [newPassword, userId]);
        updatedUser = rows[0];

    }
    catch(error){
        console.error("Error during resetting password:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
    }
    return res.status(200).json({ message: "Password reset successfully",data: updatedUser });

    
}

module.exports = {
  signup,
  login,
editprofile,
  profile,
  forgotpassword,
  resetpassword
};