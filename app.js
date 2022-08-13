// const express = require('express')
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import connectDb from './config/ConnectDb.js'
import Authrouter from './routers/auth.js'
const app = express()
const port = process.env.PORT
const dataBase_URL = process.env.DATABASE_URL
app.use(cors())

// JSON
app.use(express.json())

// DataBase Connection
connectDb(dataBase_URL)
app.use('/api/auth',Authrouter)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})