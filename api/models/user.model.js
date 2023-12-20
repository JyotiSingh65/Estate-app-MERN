import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
       
    },
    avatar : {
        type : String,
        default : "https://t4.ftcdn.net/jpg/04/85/67/07/360_F_485670786_X9jhMQrKf27exSGzaJxjGMpI1z6TcnP6.jpg"
    }

    }, {timestamps : true});

const User = mongoose.model('User', userSchema);

export default User;