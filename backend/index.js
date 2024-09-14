import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser';

//import local
import { connectDB } from './db/connectDB.js';
import authRoutes from './routes/auth.route.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json()) // allows us to parse incoming request : req.body
app.use(cookieParser()) // allows us to access cookies from the browser

app.use("/api/auth", authRoutes)


app.listen(5000, ()=>{
    connectDB()
    console.log("server is running on port 5000", PORT)
})

