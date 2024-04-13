import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRouter from '../backend/routes/user.routes.js'
import authRoute from '../backend//routes/auth.routes.js'
import listingRouter from '../backend/routes/listing.routes.js'
import cookieParser from 'cookie-parser';
import path from 'path'

dotenv.config();

const __dirname = path.resolve();

const app = express();
app.use(express.json())
app.use(cookieParser())

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log(`⚙️  mongodb connected`);
}).catch((error)=>{
    console.log("❌  connection error",error);
})

app.listen(3000,()=>{
    console.log("app is listening on port 3000");
})

app.use('/api/user',userRouter)
app.use('/api/auth',authRoute)
app.use('/api/listing',listingRouter)

app.use(express.static(path.join(__dirname, '/frontend/dist')));

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'frontend','dist','index.html'))
})


app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    return res.status(statusCode).json({
        success : false,
        statusCode,
        message
    })
})