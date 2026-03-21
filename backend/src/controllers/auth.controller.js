import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
           const err = new Error("Email already in use");
           err.statusCode = 400;
           throw err;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, role });
        res.status(201).json({ success: true, data: { message: "User registered successfully" } });
    }
    catch (error) {
        next(error);
    }
}

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            const err = new Error("Invalid email or password");
            err.statusCode = 400;
            throw err;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const err = new Error("Invalid email or password");
            err.statusCode = 400;
            throw err;
        }
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ success: true, data: { message: "Login successful", token: token } });
    }   
    catch (error) {
        next(error);
    }
}

export {
    registerUser,
    loginUser
};