import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async(req,res) => {
    // get user details from frontend
    //validation - not empty
    //check if user already exists:username,email
    //check for images,check for avatar
    // upload them to cloadinary,avatar
    //crate user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return response
    // send response back to frontend


    const {fullname,email,username,password} = req.body
    console.log("email:",email);

    if(
        [fullname,email,username,password].some((field) =>
        field?.trim() === "")
    ){
        throw new ApiError("All fields are required",400)
    }

    User.findOne({
        $or: [{username}, {email}]
    })
    if(existedUser){
        throw new ApiError("User already exists",400)
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError("Avatar is required",400)
    }
    
    const avatar  = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError("Avatar upload failed",400)
    }

    const user  = await User.create({
        fullname,
        email,
        username: username.tolowercase(),
        password,
        avatar: avatar.url,
        coverImage:coverImage?.url || "",
    })

    const createedUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createedUser){
        throw new ApiError("Something went wrong while registering the user",500)
    }

    return res.status(201).json(
        new ApiResponse(200,createedUser,"User registered successfully")
    )
})

export {registerUser}