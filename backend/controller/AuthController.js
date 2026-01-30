const express = require("express");
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const jwtToken = process.env.JWTSecret;


const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).send("All fields are required");
        }

        const curUser = await User.findOne({ email })

        if (curUser) {
            return res.status(401).send("User already exist");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const newUser = new User({
            name, email, password: hashedPass, role
        })

        await newUser.save();
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, jwtToken, { expiresIn: '2h' })
        res.status(201).send({ message: "Registered successfully", token });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Error in server while registering", error: e.message });
    }
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json("EMAIL does'nt exist or password may be wrong");
        }

        const currentUser = await User.findOne({ email });

        if (!currentUser) {
            return res.status(400).json("user does'nt exist");
        }

        const isMatch = await bcrypt.compare(password, currentUser.password);

        if (!isMatch) {
            return res.status(404).json("Wrong password");
        }
        const token = jwt.sign({ id: currentUser._id, role: currentUser.role }, process.env.JWTSecret, { expiresIn: '2h' })
        res.status(201).json({
            message: "User logged in successfully",
            token,
            role: currentUser.role,
            user: {
                id: currentUser._id,
                name: currentUser.name,
                email: currentUser.email
            }
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Error in server side", error: e.message });
    }
}

module.exports = { register, login }