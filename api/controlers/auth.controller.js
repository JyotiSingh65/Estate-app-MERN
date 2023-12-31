import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const  signup = async (req, res,next) => {

const {username, email, password} = req.body;
const hashedPassword = bcryptjs.hashSync(password, 10);
const newUser = new User({ username, email, password: hashedPassword });
try {
    await newUser.save();
    res.status(201).json('User created successfully');
}
catch (err) {
    next(err);
}
    
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body; // destructuring the request body
    try { // try to find the user in the database

        const validUser = await User.findOne({ email });
        if (!validUser) { // if the user is not found, return an error
            return next(errorHandler(404, "User not found!"));
        }
        // if the user is found, compare the passwords
        const validPassword = bcryptjs.compareSync(password, validUser.password); // compare the encrypted password
        if (!validPassword) { // if the password is not valid, return an error
            return next(errorHandler(403, "Wrong credentials!"));
        }
        // if the password is valid, generate a token
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser._doc; // get the user info without the password
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest); // send the token in a cookie

    } catch (err) {
        next(err); // pass the error to the error handler middleware
    }
};

export const google = async (req, res, next) => {
    try {

        const user = await User.findOne({ email: req.body.email });
        if(user){
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = user._doc; // get the user info without the password
            res.cookie('access_token', token, { httpOnly: true })
            .status(200)
            .json(rest); // send the token in a cookie

        } else {
            const generatedPassword =
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username:
                req.body.name.split(' ').join('').toLowerCase() +
                Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo,
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = newUser._doc;
            res
                .cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(rest);

        }

    } catch (err) {
        next(err);
    }
};


export const signout = async (req,res,next ) => {
    try{
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out');
    }
    catch(err){
        next(err);
    }
}