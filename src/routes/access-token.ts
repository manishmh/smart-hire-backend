import { Request, Response, Router } from "express";
import jwt, { Secret } from 'jsonwebtoken';
import { generateAccessToken } from "../utils/jwt";

const AccessTokenRouter = Router();

AccessTokenRouter.get('/', (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        res.status(403).json({ success: false, message: "No refresh token" })
        return;
    }

    jwt.verify(refreshToken, process.env.JWT_SECRET_TOKEN || "secret_token" as Secret, (err: any, user: any) => {
        if (err) {
            res.status(403).json({ success: false, message: "invalid refreshToken" });
            return;
        }

        req.user = user;

        const accessToken = generateAccessToken(user.sub);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        })
        res.status(200).json({ success: true, message: "accessToken generated" })
        return;
    })
})

export default AccessTokenRouter