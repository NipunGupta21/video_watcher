import mongoose,{Schema} from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSChema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lomercase:true,
            trim:true,
            index:true
        }, 
        username: {
            type: String,
            required: true,
            unique: true,
            lomercase:true,
            trim:true,
        },
        fullname: {
            type: String,
            required: true,
            index:true,
            trim:true,
        },
        avatar:{
            type: String, // cloudinary url
            required:true,
        },
        avatar:{
            type: String, // cloudinary url
        },
        watchHistory:{
            type:Schema.Types.ObjectId,
            ref:"Video"
        },
        password:{
            type:String,
            required:[true,"Password is required"]
        },
        refreshToken:{
            type:String,

        },
    },
    {
        timestamps:true
    }
)

userSChema.pre("save",async function (next) {
    if(this.isModified("password")){
    this.password = bcrypt.hash(this.password,10)
    next()
    } 
})

userSChema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSChema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:print.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSChema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:print.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSChema)