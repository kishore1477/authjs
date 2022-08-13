import User from "../moddle/User.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import { body, validationResult } from 'express-validator';

class UserController{
    static UserRegisteration = async(req,res)=>{
          // handle request body  parameters error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
        const {name,email,password,password_confirm, tc} = req.body
        const emailfind =  await  User.findOne({email}) 
        if(emailfind){
            res.send("Email already exists, please enter another email")
        }else{
        if(name &&  email && password && password_confirm && tc ){

if( password === password_confirm){
    const salt =await  bcrypt.genSalt(10)
    const hashPass = await bcrypt.hash(password,salt)
const UserData = new User({
    name:name,
    email:email,
    password :hashPass,
    tc:tc
})
const UserDataSave = await UserData.save()
const findsavedUser =  await User.findOne({email})
// Generate JWT token 
const token = jwt.sign({userID:findsavedUser._id}, process.env.JWT_SECRET_KEY,{expiresIn:'5d' })
res.send({"token":token})
}else{
    res.status(401).send('Password does not match')

}
        }else{
            res.status(401).send('All fields are required')
        }
    }
}

//  User login 
static UserLogin = async (req,res)=>{
    try {
        const {email, password} = req.body

        if(email && password){
            const user = await User.findOne({email})
            if(user !=null){
                const isMatch = await bcrypt.compare(password,user.password)
                if(user.email === email && isMatch){
                    //  token gnerate for login
                    const token = jwt.sign({userID:user._id}, process.env.JWT_SECRET_KEY,{expiresIn:'5d' })
res.status(200).send({"token":token})
                    
                }else{
                    res.status(200).send("Invalid credentials")

                }

            }else{
                res.status(400).send("User does'not exists")
            }
        }else{
            res.status(400).send("All field are required")
        }
    } catch (error) {
        
    }
}
}

export default UserController