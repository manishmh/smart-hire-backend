import { Router } from "express";
import LoginRouter from "./login";
import RegisterRouter from "./register";
import AccessTokenRouter from "./access-token";
import ResetPasswordRouter from "./reset-password";
import NewPasswordRouter from "./new-password";
import EmailVerificationRouter from "./email-verification";

const router = Router();

router.use('/login', LoginRouter)
router.use('/register', RegisterRouter)
router.use('/access-token', AccessTokenRouter)
router.use("/reset-password", ResetPasswordRouter)
router.use("/new-password", NewPasswordRouter)
router.use("/email-verification", EmailVerificationRouter)

export default router;