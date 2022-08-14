import express, { application } from "express";
import UserController from "../controllers/authController.js";
const Authrouter = express.Router()
// const expressValid = require('express-validator');
import { body, validationResult } from 'express-validator';
import Userauth from "../middlewares/auth_middleware.js";
// application.use('/cha')
Authrouter.use('/changePassword',Userauth)
Authrouter.use('/LoggedUserData',Userauth)
// Public routes
Authrouter.post('/register', [body("name", "Enter a valid name.").isLength({ min: 3 })], UserController.UserRegisteration)
Authrouter.post('/login', UserController.UserLogin)
Authrouter.post('/sendEmail', UserController.sendEmail)
Authrouter.post('/passwordReset/:id/:token', UserController.passwordReset)
// protected  routes
Authrouter.post('/changePassword', UserController.changePassword)
Authrouter.post('/LoggedUserData', UserController.LoggedUserData)


export default Authrouter