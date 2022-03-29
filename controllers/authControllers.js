import jwt from "jsonwebtoken"
import sgMail from "@sendgrid/mail"
import dotenv from "dotenv"
import bcrypt from "bcrypt"
import { Account } from "../models/Account.js"

dotenv.config()

const CLIENT_URL = "http://localhost:3000"
const SERVER_URL = "http://localhost:8000"

const sendGrid = async (email, token, mode) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    if (mode === "signup") {

        const message = {
            to: email,
            from: process.env.SENDGRID_ACC_EMAIL,
            html: `<p> Please verify your email by clicking the link below.</p>
                    <a href="${SERVER_URL}/verify/${token}">Link</a>`
        }
        return await sgMail.send(message)
    }

    const message = {
        to: email,
        from: process.env.SENDGRID_ACC_EMAIL,
        html: `<p> Please click the below link to reset your password.</p>
                <a href="${CLIENT_URL}/reset/${token}"></a>`
    }

    return await sgMail.send(message)
}

export const signupUser = async (req, res) => {
    try {
        const { email, name, password } = req.body;
        const response = await Account.findOne(email)
        if (!response) return res.status(404).json({ message: "Email already exists." })

        const salt = bcrypt.genSalt(10)
        const hashedPassword = bcrypt.hash(password, salt)


        const token = jwt.sign({ id: email }, process.env.JWT_SECRET_KEY, { expiresIn: "30m" })

        const mail = await sendGrid(email, token, mode = "signup")

        if (!mail) return res.status(400).json({ message: "Sendgrid error" })

        await Account.insertOne({ email, name, password: hashedPassword })

        res.status(200).json({ message: "Account Registered,please verify your email before logging in" })
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}

export const verifyUser = (req, res) => {
    const { token } = req.params;
    try {
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, res) => {
            if (err) return res.status(500).json({ message: "Token expired or Invalid Token" })

            const tokenVerify = await Account.findOne({ accountVerifyToken: token })
            if (!tokenVerify) return res.status(500).json({ message: "Token does not exist" })
            await Account.updateOne({ isVerifyToken: true, accountVerifyToken: undefined })

            res.status(200).json({ message: "Account Verified Successfully" })
        })
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const response = await Account.findOne(email)
        if (!response) return res.status(403).json({ message: "Invalid Credentials" })

        const passResponse = await bcrypt.compare(password, response.password)

        if (!passResponse) return res.status(403).json({ message: "Invalid Credentials" })

        const token = jwt.sign({ accountId: response._id }, process.env.JWT_SECRET_KEY, { expiresIn: "8hr" })

        res.status(200).json({ token })

    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const response = await Account.findOne(email)
        if (!response) return res.status(401).json({ message: "Email does not exist" })

        const token = jwt.sign({ accountId: response._id }, process.env.JWT_SECRET_KEY, { expiresIn: "10m" })

        const mail = await sendGrid(email, token, mode = "forgotPassword")

        if (!mail) return res.status(400).json({ message: "Sendgrid error" })

        await Account.updateOne({ email }, { $set: { resetLink: token } })

        res.status(200).json({ message: "Reset Link has been sent your email." })

    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}

export const resetPassword = async (req, res) => {
    const { resetLink, password } = req.body;
    try {
        const response = await Account.findOne({ resetLink })
        if (!response) return res.status(403).json({ message: "Invalid token or Token Expired" })

        const salt = bcrypt.genSalt(10)
        const hashedPassword = bcrypt.hash(password, salt)

        await response.updateOne({ resetLink }, { $set: { resetLink: "", password: hashedPassword } })

        res.status(200).json({ message: "Password changed successfully" })
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}


export const getLoggedInUser = async (req, res) => {
    try {
        const response = await Account.findById(req.user)
        res.status(200).json({ user: response })
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}