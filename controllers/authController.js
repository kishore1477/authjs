import User from "../moddle/User.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import { body, validationResult } from 'express-validator';
import transporter from "../config/emailConfig.js";

class UserController {
    // User Register
    static UserRegisteration = async (req, res) => {
        // handle request body  parameters error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password, password_confirm, tc } = req.body
        const emailfind = await User.findOne({ email })
        if (emailfind) {
            res.send("Email already exists, please enter another email")
        } else {
            if (name && email && password && password_confirm && tc) {

                if (password === password_confirm) {
                    const salt = await bcrypt.genSalt(10)
                    const hashPass = await bcrypt.hash(password, salt)
                    const UserData = new User({
                        name: name,
                        email: email,
                        password: hashPass,
                        tc: tc
                    })
                    const UserDataSave = await UserData.save()
                    const findsavedUser = await User.findOne({ email })
                    // Generate JWT token 
                    const token = jwt.sign({ userID: findsavedUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
                    res.send({ "token": token })
                } else {
                    res.status(401).send('Password does not match')

                }
            } else {
                res.status(401).send('All fields are required')
            }
        }
    }

    //  User login 
    static UserLogin = async (req, res) => {
        try {
            const { email, password } = req.body

            if (email && password) {
                const user = await User.findOne({ email })
                if (user != null) {
                    const isMatch = await bcrypt.compare(password, user.password)
                    if (user.email === email && isMatch) {
                        //  token gnerate for login
                        const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
                        res.status(200).send({ "token": token })

                    } else {
                        res.status(200).send("Invalid credentials")

                    }

                } else {
                    res.status(400).send("User does'not exists")
                }
            } else {
                res.status(400).send("All field are required")
            }
        } catch (error) {

        }
    }
    // user change password 
    static changePassword = async (req, res) => {
        const { password, password_confirm } = req.body
        if (password && password_confirm) {
            if (password === password_confirm) {
                const salt = await bcrypt.genSalt(10)
                const hashPass = await bcrypt.hash(password, salt)
                console.log(req.user)
                await User.findByIdAndUpdate(req.user._id, { $set: { password: hashPass } })
                res.send("Password changed successfully")
            } else {

                res.status(400).send("password does not  match")
            }
        } else {
            res.status(400).send("All fields are required!")
        }
    }
    static LoggedUserData = (req, res) => {
        res.status(200).send(req.user)
    }

    static sendEmail = async (req, res) => {
        const { email } = req.body
        if (email) {
            console.log(email)
            try {
               
           
            const user = await User.findOne({ email })
            console.log(user)
            if (user) {
                const secret = user._id + process.env.JWT_SECRET_KEY
                const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '15m' })
                const link = `http://127.0.0.1:8000/api/user/reset/${user._id}/${token}`
                console.log(link)

                 // Send Email
        let info =  await transporter.sendMail({
          from:"kishorejaipal477@gmail.com",
          to: user.email,
          subject: "KishoreAuth - Password Reset Link",
          html: `<a href=${link}>Click Here</a> to Reset Your Password`
        })
        console.log(info)
            } else {
                res.send({ "status": "failed", "message": "Email doesn't exists " })

            }

        } catch (error) {
                res.status(400).json({"message":"Internal error", "Error":error})
        }
        } else {
            res.send({ "status": "failed", "message": "Email Field is Required" })
        }
    }

    static passwordReset = async (req, res) => {
        const { password, password_confirm } = req.body
        console.log(req.body)
        const { id, token } = req.params
        console.log(req.params)
        const user = await User.findById(id)
        console.log(user)
        const new_secret = user._id + process.env.JWT_SECRET_KEY
        try {
        jwt.verify(token, new_secret)
            // let verifyToken = jwt.verify(token, new_secret)
            // console.log(verifyToken)
            if (password && password_confirm) {
                if (password === password_confirm) {
                    const salt = await bcrypt.genSalt(10)
                    const newHashPassword = await bcrypt.hash(password, salt)
                    await User.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } })
                    res.status(200).send({ "status": "success", "message": "Password Reset Successfully" })
                } else {
                    res.status(400).send("Password does not match!")
                }
            } else {
                res.status(400).send("All field are required.")

            }
        } catch (error) {
            res.status(400).send("Internal Server Error Occured")

        }
    }
}

export default UserController