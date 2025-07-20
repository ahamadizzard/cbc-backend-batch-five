import User from "../models/usersModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
import nodemailer from "nodemailer";
import OTP from "../models/otpModel.js";

dotenv.config();

export function isAdmin(req) {
  if (req.user == null) {
    return false;
  }
  // Check if the user is authenticated and has the role of admin
  if (req.user.role != "admin") {
    return false;
  }
  return true;
}

export function createUser(req, res) {
  if (req.body.role == "admin") {
    if (req.user != null) {
      if (req.user.role != "admin") {
        res.status(403).json({
          message:
            "You are not authorized to create an admin account, please login as an admin",
        });
        return;
      }
    } else {
      res.status(403).json({
        message:
          "You are not authorized to create an admin account, please login first",
      });
      return;
    }
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  const user = new User({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: hashedPassword,
    role: req.body.role, // "admin" or "customer"
    imgURL: req.body.imgURL,
  });
  user
    .save()
    .then(() => {
      res.status(201).json({ message: "User created successfully" });
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
      console.log(error);
    });
}
export function loginUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }).then((user) => {
    if (user == null) {
      res.status(404).json({ message: "User not found" });
    } else {
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (isPasswordValid) {
        // generate token and send it to the client
        const token = jwt.sign(
          {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            imgURL: user.imgURL,
          },
          process.env.JWT_TOKEN_SECRET
        );
        res.json({
          message: "Login Successfull",
          token: token,
          role: user.role,
          firstName: user.firstName,
        });
        // res.status(200).json({ message: "Login successful" });
      } else {
        res.status(401).json({ message: "Invalid password" });
      }
    }
  });
}
export function getAllUsers(req, res) {
  if (!isAdmin(req)) {
    res
      .status(403)
      .json({ message: "You are not authorized to access this route" });
    return;
  }
  User.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
}

export function updateUser(req, res) {
  if (!isAdmin(req)) {
    res
      .status(403)
      .json({ message: "You are not authorized to access this route" });
    return;
  }
  User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
}

export function deleteUser(req, res) {
  if (!isAdmin(req)) {
    res
      .status(403)
      .json({ message: "You are not authorized to access this route" });
    return;
  }
  User.findByIdAndDelete(req.params.id)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
}

export function getUserByEmail(req, res) {
  User.findOne({ email: req.params.email })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
}

export async function loginWithGoogle(req, res) {
  const token = req.body.accessToken;
  // check if token is provided
  if (token == null) {
    res.status(400).json({
      message: "Access token is required",
    });
    return;
  }
  // get user info from google
  const response = await axios.get(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  // console.log(response.data);

  // check if user exists in the database
  const user = await User.findOne({
    email: response.data.email,
  });
  // if user does not exist, create a new user
  if (user == null) {
    const newUser = new User({
      email: response.data.email,
      firstName: response.data.given_name,
      lastName: response.data.family_name,
      password: "googleUser",
      role: "customer",
      imgURL: response.data.picture,
    });
    await newUser.save();
    const token = jwt.sign(
      {
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        imgURL: newUser.imgURL,
      },
      process.env.JWT_TOKEN_SECRET
    );
    res.json({
      message: "Login Successfull",
      token: token,
      role: newUser.role,
      firstName: newUser.firstName,
    });
  } else {
    // if user exists, generate a token and send it to the client
    const token = jwt.sign(
      {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        imgURL: user.imgURL,
      },
      process.env.JWT_TOKEN_SECRET
    );
    res.json({
      message: "Login Successfull",
      token: token,
    });
  }
}

const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "izzardahamad@gmail.com",
    pass: process.env.GOOGLE_TEMP_APP_PASSWORD,
  },
});

export async function sendOTP(req, res) {
  //javy zfzy dwsd rmbg
  const randomOTP = Math.floor(100000 + Math.random() * 900000);
  const email = req.body.email;
  if (email == null) {
    res.status(400).json({
      message: "Email is required",
    });
    return;
  }
  const user = await User.findOne({
    email: email,
  });
  if (user == null) {
    res.status(404).json({
      message: "User not found",
    });
  }

  //delete all otps
  await OTP.deleteMany({
    email: email,
  });

  const message = {
    from: "malithdilshan27@gmail.com",
    to: email,
    subject: "Resetting password for crystal beauty clear.",
    text: "This your password reset OTP : " + randomOTP,
  };

  const otp = new OTP({
    email: email,
    otp: randomOTP,
  });
  await otp.save();
  transport.sendMail(message, (error, info) => {
    if (error) {
      res.status(500).json({
        message: "Failed to send OTP",
        error: error,
      });
    } else {
      res.json({
        message: "OTP sent successfully",
        otp: randomOTP,
      });
    }
  });
}

export async function resetPassword(req, res) {
  const otp = req.body.otp;
  const email = req.body.email;
  const newPassword = req.body.newPassword;
  // console.log(otp);
  const response = await OTP.findOne({
    email: email,
  });

  if (response == null) {
    res.status(500).json({
      message: "No otp requests found please try again",
    });
    return;
  }
  if (otp == response.otp) {
    await OTP.deleteMany({
      email: email,
    });
    // console.log(newPassword);

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    const response2 = await User.updateOne(
      { email: email },
      {
        password: hashedPassword,
      }
    );
    res.json({
      message: "password has been reset successfully",
    });
  } else {
    res.status(403).json({
      message: "OTPs are not matching!",
    });
  }
}

// Get current authenticated user
export const getCurrentUser = (req, res) => {
  if (!req.user) {
    return res.status(403).json({ message: "Not authorized" });
  }

  res.json({
    ...req.user,
    // email: req.user.email,
    // firstName: req.user.firstName,
    // lastName: req.user.lastName,
    // role: req.user.role,
    // avatar: req.user.imgURL,
  });
};
