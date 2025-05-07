import { Router } from "express";
import LoginRouter from "./login";
import RegisterRouter from "./register";
import AccessTokenRouter from "./access-token";
import VerifyTokenRouter from "./verify-token";

const router = Router();

router.use('/login', LoginRouter)
router.use('/register', RegisterRouter)
router.use('/access-token', AccessTokenRouter)
router.use('/verify-token', VerifyTokenRouter)

export default router;