import jwt from 'jsonwebtoken';
import { ENV } from '../lib/env.js';
import User from '../model/user.model.js';

export const protectedRoute = async (req, res, next) => {

    try {
        const token = req.cookies.jwt
        if (!token) return res.status(401).json({ message: "Unauthorized - No token provided!" })

        const decoded = jwt.verify(token, ENV.JWT_SECRET)
        if (!decoded) return res.status(401).json({ message: "Unauthorized - Invalid token" })

        const user = User.findById(decoded.userId)
        if (!user) return res.status(404).json({ message: "User not found!" })

        req.user = user
        next()
    } catch (error) {
        console.log("Error in protecteRoute", error);
        res.status(500).json({ message: "Internal server error!" })
    }
}