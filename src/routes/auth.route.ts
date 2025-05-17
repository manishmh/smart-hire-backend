import { Router } from "express";
import AccessTokenRouter from "./auth/access-token";
import EmailVerificationRouter from "./auth/email-verification";
import LoginRouter from "./auth/login";
import NewPasswordRouter from "./auth/new-password";
import RegisterRouter from "./auth/register";
import ResetPasswordRouter from "./auth/reset-password";
import VerifyTokenRouter from "./auth/verify-token";
import NewFormRouter from "./dashboard/new-form";
import FormSectionRouter from "./dashboard/form-section";
import FormFieldRouter from "./dashboard/form-field";
import FormOptionRouter from "./dashboard/form-option";

const router = Router();

// auth routers
router.use('/login', LoginRouter)
router.use('/register', RegisterRouter)
router.use("/reset-password", ResetPasswordRouter)
router.use("/new-password", NewPasswordRouter)
router.use("/email-verification", EmailVerificationRouter)

// Auth Token verfication router
router.use('/access-token', AccessTokenRouter)
router.use("/verify-token", VerifyTokenRouter)

// Dashbaord routers
router.use("/new-form", NewFormRouter)
router.use("/form-section", FormSectionRouter)
router.use("/form-field", FormFieldRouter)
router.use("/field-option", FormOptionRouter)

export default router;