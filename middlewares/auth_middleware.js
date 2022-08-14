import jwt from "jsonwebtoken"
import User from "../moddle/User.js"

const Userauth =async(req,res, next)=>{
const {authorization} = req.headers
console.log(req.headers)

if(authorization){
    try {
        console.log(authorization)
   
// fetchuserID
const {userID} =  jwt.verify(authorization,process.env.JWT_SECRET_KEY)
// console.log("response", responsee)
// const {userID} =  jwt.verify(authorization,process.env.JWT_SECRET_KEY)
if(userID){
    // fetch user form UserId
    req.user = await User.findById(userID).select('-password')
    next()

}else{
    res.status(401).send("Invalid token")
}

} catch (error) {
        res.send("Internal error Occured")
}

}else{
    res.status(401).send("Please enter a token")
}
}
export default Userauth