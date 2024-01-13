import  { asyncHandler}  from '../utils/asyncHandler.js'
import  { ApiError } from '../utils/apiError.js'
import  { User } from '../models/user.model.js'
import  { uploadOnCloudinary } from'../utils/cloudinary.js';
import  { apiResponse as ApiResponse, apiResponse } from '../utils/apiResponse.js';



 const generateAccessAndRefreshToken = async (userId) => {
 
    try {
        const user = await User.findById(userId);
        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();
        user.refreshToken=refreshToken;
        await user.save({ validateBeforeSave: false })
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(400,'User not found')
    }
 }
const registerUser = asyncHandler( async (req,res)=>{

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
        const userFromDatabase = await User.create({
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
       const user = await userFromDatabase.findById(userFromDatabase._id)
        if(!userFound){
            throw new ApiError(500,'something went wrong in server')
        }
     return res.status(201).json(
        new ApiResponse(400,userFound)
     )   
})
const loginUser = asyncHandler( async (req,res)=>{
const {username,email,password} = req.body;
 if(!username||!email){
    throw new ApiError(400,'usename andemail not found');
 }
  const userData = await User.findOne({
    $or:[{ username }, { email }]
  })
  if(!userData){
    throw new ApiError(404, 'user does not exist')
  }
  const isPasswordCorrect = User.isPasswordCorrect(password)

  if(!isPasswordCorrect){
    return new ApiError(404,'Password Wrong')
  }

const refreshandAcccesToken = await generateAccessAndRefreshToken(userData._id);
//first one 
const loggedInUser = User.findById(userData._id).select("-password -refreshToken")
const options = {
    httpOnly: true,
    secure: true
}
return res
.status(200)
.cookie("refreshToken",refreshToken)
.cookie('accessToken',accessToken)
.json(new apiResponse(
    200,
    {
        user:loggedInUser,accessToken,refreshToken,
        
    },
     'user logged in'
     ))
})

const logOutUser = asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
            {
                $unset: {
                    refreshToken: 1 // this removes the field from document
                }
            },
            {
                new: true
            }
        )
        const options = {
            httpOnly: true,
            secure: true
        }
        return res.
        status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
})
export {registerUser,
        loginUser,
        logOutUser
      }