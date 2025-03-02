const express = require("express");
const cors = require("cors");
const colors = require("colors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const nodemailer = require('nodemailer');
const connectDB = require("./configDB");
// const cloudinary = require('cloudinary').v2;

//load envirnment variables .env
dotenv.config();

//Mongo db connection
connectDB();

//Config cloudinary
// cloudinary.config({
//     cloud_name: 'your_cloud_name',
//     api_key: 'your_api_key',
//     api_secret: 'your_api_secret',
// });

//REST OBJECT
const app = express();

//middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

//ROUTES
app.use(require('./routes/UserRoutes'));
app.use(require("./routes/PostRoutes"));

const Users = require('./models/Users');
const bcrypt = require("bcrypt");

let otpStore = {}; // Temporary store for OTPs

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'coderamchandra@gmail.com',
    pass: 'rgvs mpfr aqhe ieqg',
  },
});

const router = express.Router();

router.post('/send-otp', (req, res) => {
    try {
     const { email } = req.body;
     const user = Users.findOne({ email });
            if (user.username) { 
              return res.status(404).send({
                 success: false, 
                 message: "User not found" ,
                    }); 
                }
     console.log(user.username)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;
    const mailOptions = {
      from: 'coderamchandra@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error)
        return res.status(500).send({ success: false, message: 'Failed to send OTP in' });
      }
      res.status(200).send({ success: true, message: 'OTP sent successfully' });
    });
    } catch (error) {
        console.log(error);
      res.status(500).send({
        success: false,
        message: "Error In User Update Api",
        error,
      });
    }
    
  });

  app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    if (otpStore[email] && otpStore[email] === otp) {
      delete otpStore[email];
      res.status(200).send({ success: true, message: 'OTP verified successfully' });
    } else {
      res.status(400).send({ success: false, message: 'Invalid OTP' });
    }
  });

  app.put('/reset-password', (req, res) => {
    try {
        const { email, newPassword } = req.body;
            const hashedPassword = newPassword ? bcrypt.hash(newPassword,10) : undefined;
            const updatePassword = Users.findOneAndUpdate(
                    { email },
                    {
                      password: hashedPassword
                    },
                    { new: true }
                  );
    res.status(200).send({ success: true, message: 'Password reset successful' });
    } catch (error) {
        console.log(error);
      res.status(500).send({
        success: false,
        message: "Error In User Update Api",
        error,
      });
    }
  });

//PORT
const  PORT = process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log(`Node js server started on PORT : ${PORT} `.bgGreen.white);
})