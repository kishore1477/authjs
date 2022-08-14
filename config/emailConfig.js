import dotenv from 'dotenv'
dotenv.config()
import nodemailer from 'nodemailer'
let testAccount = await nodemailer.createTestAccount();
let transporter = nodemailer.createTransport({
  // host: process.env.EMAIL_HOST,
  host: "smtp.gmail.com",
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "kishorejaipal477@gmail.com", // Admin Gmail ID
    pass: "pnrqelqyanidunmg", 
    // Admin Gmail Password
    // user: testAccount.user, // Admin Gmail ID
    // pass: testAccount.pass, // Admin Gmail Password
  },
})

export default transporter