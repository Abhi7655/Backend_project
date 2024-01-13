import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
import  { User } from '../models/user.model.js'
 export const verifyJwt = asyncHandler(async(req,res,next)=>{
try {
        const token= req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!token){
         throw new ApiError(401,'not found');
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select('-password -refreshToken')
        if(!user){
            throw new ApiError(401,'not found');
           }
           req.user=user
           next()
     }
 catch (error) {
    throw new ApiError('400',error.message)
   }
})