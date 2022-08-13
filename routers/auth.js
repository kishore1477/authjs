import express from "express";
import UserController from "../controllers/authController.js";
const Authrouter = express.Router()
// const expressValid = require('express-validator');
import { body, validationResult } from 'express-validator';
Authrouter.post('/register', [body("name", "Enter a valid name.").isLength({ min: 3 })], UserController.UserRegisteration)
Authrouter.post('/login', UserController.UserLogin)

export default Authrouter