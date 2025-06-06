import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js'

const server = express()
connectDB()
const port = process.env.PORT || 4000
server.use(express.json())
server.use(cookieParser())

const allowedOrigins = ["http://localhost:5173"]

server.use(cors({origin : allowedOrigins, credentials : true}))

server.get("/", (req, res) => res.send("API working"))
server.use("/api/auth", authRouter)
server.use("/api/user", userRouter)

server.listen(port, () => console.log(`server started successfully on ${port}`))
