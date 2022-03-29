import express from "express";
import { forgotPassword, getLoggedInUser, loginUser, resetPassword, signupUser, verifyUser } from "../controllers/authControllers.js";
import { auth } from "../middleware/auth.js";

const router = express.Router()

router.post('/', signupUser)

router.post('/login', loginUser)

router.get('/verify/:token', verifyUser)

router.put('/forgotPassword', forgotPassword)

router.put('/resetPassword', resetPassword)

router.get('/auth', auth, getLoggedInUser)

export const authenticationRouter = router;