import  { asyncHandler}  from '../utils/asyncHandler.js'
import  { ApiError } from '../utils/apiError.js'
import  { User } from '../models/user.model.js'
import  { uploadOnCloudinary } from'../utils/cloudinary.js';
import  { apiResponse as ApiResponse } from '../utils/apiResponse.js';





const registerUser = asyncHandler( async (req,res)=>{
       // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
    const{ fullName , email , userName , password } = req.body
    
    if([ fullName , email , userName , password ].some((field)=>{
              field?.trim() === ""
        })
        ){
            throw new ApiError(400,'All fields are required')
        }

        const existedUser = await User.findOne({
            $or:[{ userName }, { email }]
        })

        if(existedUser){
            throw new ApiError(409,'User already Exist')
        }
        const avatarLocalPath = req.files?.avatar[0]?.path;
        const coverImageLocalPath = req.field?.coverImage[0]?.path;
        if(!avatarLocalPath){
            throw new ApiError(400,'Avatar Is required')
        }
        const avatarUpload = await uploadOnCloudinary(avatarLocalPath)
        const CoverImageUpload = await uploadOnCloudinary(coverImageLocalPath)

        if(!avatarUpload){
            throw new ApiError(400,'12 Is required')
        }
        const user = await User.create({
            fullName,
            avatar:avatarUpload.url,
            coverImage:CoverImageUpload?.url || '',
            userName:userName.toLowerCase(),
            email,
            password

        })
        const userFound = await User.findById(user._id).select(
            "-password -refreshToken"
        )

        if(!userFound){
            throw new ApiError(500,'something went wrong in server')
        }

     return res.status(201).json(
        new ApiResponse(400,userFound)
     )   
})

export {registerUser}