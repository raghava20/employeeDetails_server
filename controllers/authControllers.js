import jwt from "jsonwebtoken"
import sgMail from "@sendgrid/mail"
import dotenv from "dotenv"
import bcrypt from "bcrypt"
import { Account } from "../models/Account.js"

dotenv.config()

const CLIENT_URL = "https://preeminent-cannoli-a4d009.netlify.app"
const SERVER_URL = "https://employee-details--app.herokuapp.com"

// sendgrid package for email notification
const sendGrid = async (email, token, mode) => {

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    if (mode === "signup") {

        const message = {
            to: email,
            from: process.env.SENDGRID_ACC_EMAIL,
            subject: "Verify your Account on Employee Details",
            html: `<p> Please verify your email by clicking the link below.</p>
                    <a> ${SERVER_URL}/verify/${token} </a>
                    `
        }
        try {
            await sgMail.send(message)
            return "success"
        }
        catch (err) {
            console.log(err)
        }
    }

    const message = {
        to: email,
        from: process.env.SENDGRID_ACC_EMAIL,
        subject: "Reset your password",
        html: `<p> Please click the below link to reset your password.</p>
                <a>${CLIENT_URL}/reset/${token}</a>
                `
    }
    try {
        await sgMail.send(message)
        return "success"
    }
    catch (err) {
        console.log(err)
    }
}

// signup the user
export const signupUser = async (req, res) => {
    try {
        const { email, name, password } = req.body;
        const response = await Account.findOne({ email })

        if (response) return res.status(404).json({ message: "Email already exists." })

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const token = jwt.sign({ id: email }, process.env.JWT_SECRET_KEY, { expiresIn: "30m" })
        console.log(token)

        const mode = "signup"
        const mail = await sendGrid(email, token, mode)
        console.log(mail)

        if (!mail) return res.status(400).json({ message: "Sendgrid error" })

        const account = new Account({ email, name, password: hashedPassword, accountVerifyToken: token })
        await account.save()

        res.status(200).json({ message: "Account Registered,please verify your email before logging in" })
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}

// verify the user before logging in
export const verifyUser = async (req, res) => {
    const { token } = req.params;
    try {
        await jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, result) => {
            if (err) return res.status(500).json({ message: "Token expired or Invalid Token" })

            const tokenVerify = await Account.findOne({ accountVerifyToken: token })

            if (!tokenVerify) return res.status(500).json({ message: "Token does not exist" })
            await Account.findOneAndUpdate({ accountVerifyToken: token }, { $set: { isAccountVerified: true, accountVerifyToken: "" } })

            res.status(200).json({ message: "Account Verified Successfully" })
        })
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}

// login the user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const response = await Account.findOne({ email })
        if (!response) return res.status(403).json({ message: "Invalid Credentials" })

        const passResponse = await bcrypt.compare(password, response.password)

        if (!passResponse) return res.status(403).json({ message: "Invalid Credentials" })

        const token = jwt.sign({ accountId: response._id }, process.env.JWT_SECRET_KEY, { expiresIn: "8hr" })

        res.status(200).json({ token, role: response.role })

    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}

// forgot password for valid emailid
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const response = await Account.findOne({ email })
        if (!response) return res.status(401).json({ message: "Email does not exist" })

        const token = jwt.sign({ accountId: response._id }, process.env.JWT_SECRET_KEY, { expiresIn: "10m" })
        console.log(token)

        const mode = "forgotPassword"
        const mail = await sendGrid(email, token, mode)

        if (!mail) return res.status(400).json({ message: "Sendgrid error" })

        await Account.updateOne({ email }, { $set: { resetLink: token } })

        res.status(200).json({ message: "Reset Link has been sent your email." })

    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}

// resetPassword 
export const resetPassword = async (req, res) => {
    const { resetLink, password } = req.body;
    try {
        console.log(resetLink)
        const response = await Account.findOne({ resetLink })
        if (!response) return res.status(403).json({ message: "Invalid token or Token Expired" })

        console.log(response)
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        await Account.updateOne({ resetLink }, { $set: { resetLink: "", password: hashedPassword } })

        res.status(200).json({ message: "Password changed successfully" })
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}

// get the logged in user details
export const getLoggedInUser = async (req, res) => {
    try {
        const response = await Account.findById(req.user)
        res.status(200).json({ user: response })
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}