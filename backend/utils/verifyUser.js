import jwt  from 'jsonwebtoken';
import {errorHandler} from '../utils/errorHandler.js'

export const verifyUser = (req,res,next)=>{

    const token = req.cookies.access_token;

    if(!token) return next(errorHandler(401,'Unauthorized'))

    jwt.verify(token,process.env.TOKEN_SECRET,(err,user)=>{

        if(err) return next(errorHandler(400,'Forbidden'))

        req.user = user;
        next();
    })
}