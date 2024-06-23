import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFile:{
            type:String, //cloudinary url
            required:true
        },
        thumbnail:{
            type:String, //cloudinary url
            required: true
        },
        title:{
            type:String, //cloudinary url
            required: true
        },
        description:{
            type:String, 
            required: true
        },
        duration:{
            type:String, //cloudinary url
            required: true
        },
        view:{
            type:number,
            default:0
        },
        isPublished:{
            type:Boolean,
            default:true
        },
        onwer:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    },
    {
        timeStamps:true
    }
)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video",videoSchema)