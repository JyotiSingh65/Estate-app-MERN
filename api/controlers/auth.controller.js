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
    res.status(201).json("User created successfully");
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
        const { password: userPassword, ...rest } = validUser._doc; // get the user info without the password
        res.cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest) // send the token in a cookie

    } catch (err) {
        next(err); // pass the error to the error handler middleware
    }
}