import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    lastlogin:{
        type: Date,
        default: Date.now
    },
  
    isVerified:{
        type: Boolean,
        default: false
    },
    resetpasswordToken:String,
    resetpasswordExpiresAt:Date,
    verificationToken:String,
    verificationExpires:Date
}, {timestamps: true})

//createat and updatedat fields are automatically added by mongoose
export const User = mongoose.model("User", userSchema)