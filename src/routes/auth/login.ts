import bcryptjs from 'bcryptjs';
import { Request, Response, Router } from "express";
import { db } from "../../lib/db";
import { loginSchema } from "../../schema/input-validation";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";

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

        const { email } = verifiedSchema.data;
        const UserPassword = verifiedSchema.data.password;

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

        const { password, ...user } = existingUser;
        const correctPassword = await bcryptjs.compare(UserPassword, password);
        if (!correctPassword) {
            res.status(403).json({
                success: false,
                message: "Invalid credentials"
            });
            return;
        }

        const { id, role } = existingUser;
        const accessToken = generateAccessToken({ id, email, role })
        const refreshToken = generateRefreshToken({ id, email, role });
        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "none",
            maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
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