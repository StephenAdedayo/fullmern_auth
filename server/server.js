import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import authRouter from './routes/authRoutes.js'

const server = express()
connectDB()
const port = process.env.PORT || 4000
server.use(express.json())
server.use(cookieParser())
server.use(cors({credentials : true}))

server.get("/", (req, res) => res.send("API working"))
server.use("/api/auth", authRouter)

server.listen(port, () => console.log(`server started successfully on ${port}`))
