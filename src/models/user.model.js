import { type } from "express/lib/response";
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new Schema({
    username: {
        type: string,
        required: true,
        unique: true,
        lowercse: true,
        trim: true,
        index: true,
    },
    email:{
        type: string,
        required: true,
        unique: true,
        lowercse: true,
        trim: true,
        index: true,
    },
    fullName:{
        type: string,
        required: true,    
        trim: true,
        index: true,
    },
    avatar:{
        type: string, //cloudinary url
        required: true,

    },
    coverImage:{
        type: string, //cloudinary url
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref: "video",
        }
    ],
    password:{
        type: string,
        required: [true, 'password is required'],
    },
    refreshToken: {
        type: string,
    },
    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {
    if(!this.isModified ("password")) return next();

    this.password = bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generaeAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }

    )
}
userSchema.methods.generaeRfreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }

    )
}

export const user = mongoose.model("user", userSchema)