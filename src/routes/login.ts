import bcryptjs from 'bcryptjs';
import { Request, Response, Router } from "express";
import { db } from "../lib/db";
import { loginSchema } from "../schema/input-validation";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

const LoginRouter = Router();

LoginRouter.post("/", async (req: Request, res: Response) => {
    try {
        const userData = req.body;
        const verifiedSchema = loginSchema.safeParse(userData);

        if (!verifiedSchema.success) {
            res.status(400).json({
                success: false,
                message: verifiedSchema.error.errors[0].message
            });
            return;
        }

        const { email, password } = verifiedSchema.data;

        const existingUser = await db.user.findUnique({
            where: { email }
        });

        if (!existingUser) {
            res.status(404).json({
                success: false,
                message: "User does not exist. Create a new account"
            });
            return;
        }

        const correctPassword = await bcryptjs.compare(password, existingUser.password);
        if (!correctPassword) {
            res.status(403).json({
                success: false,
                message: "Invalid credentials"
            });
            return;
        }

        const accessToken = generateAccessToken(existingUser.email);
        const refreshToken = generateRefreshToken(existingUser.email);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        const user = {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            accessToken: accessToken,
            refreshToken: refreshToken,
            createdAt: existingUser.createdAt,
        }

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            accessToken,
            refreshToken,
            user: user
        });
        return;

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
        return;
    }
})

export default LoginRouter;