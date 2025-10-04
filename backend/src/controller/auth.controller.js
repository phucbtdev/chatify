import { ENV } from "../lib/env.js";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req, res) => {

    const { fullName, email, password } = req.body

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({ email })
        if (user) return res.status(400).json({ message: "Email already exists!" })

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            const savedUser = await newUser.save()
            generateToken(savedUser._id, res)

            res.status(201).json({
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email
            })

            try {
                await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);
            } catch (error) {
                console.error("Failed to send welcome email:", error);
            }
        } else {
            res.status(500).json({ message: "Internal server error" })
        }

    } catch (error) {

    }
}

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: "Invalid credentials" })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" })

        generateToken(user._id, res)
        res.status(200).json({
            id: user._id,
            fullName: user.fullName,
            email: user.email
        })

    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }

}

export const logout = (_, res) => {
    res.cookie("jwt", "", {
        maxAge: 0,
    })
    res.status(200).json({ message: "Logged out successfully" })
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body
        if (!profilePic) return res.status(400).json({ message: "Profile pic is required" })

        const uploadResponse = cloudinary.uploader.upload(profilePic)

        const userId = req.user._id
        const userUpdated = await User.findByIdAndUpdate(
            userId,
            {
                profilePic: uploadResponse,
                new: true
            }
        )

        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("Error in update profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }

}