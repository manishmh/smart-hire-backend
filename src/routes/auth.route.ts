import { Router } from "express";
import LoginRouter from "./login";
import RegisterRouter from "./register";
import AccessTokenRouter from "./access-token";
import ResetPasswordRouter from "./reset-password";
import NewPasswordRouter from "./new-password";
import EmailVerificationRouter from "./email-verification";
import VerifyTokenRouter from "./verify-token";

const router = Router();

// auth routers
router.use('/login', LoginRouter)
router.use('/register', RegisterRouter)
router.use("/reset-password", ResetPasswordRouter)
router.use("/new-password", NewPasswordRouter)
router.use("/email-verification", EmailVerificationRouter)

// Token verfication router
router.use('/access-token', AccessTokenRouter)
router.use("/verify-token", VerifyTokenRouter)

export default router;