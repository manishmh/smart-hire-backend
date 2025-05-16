import { Request, Response, Router } from "express";
import { db } from "../../lib/db";
import { getVerificationTokenByToken } from "../../services/auth/verfication-token";

const EmailVerificationRouter = Router();

EmailVerificationRouter.get("/", async (req: Request, res: Response) => {
    try {
        const { token } = req.query;

        if (typeof token !== "string" || !token) {
            res.status(400).json({ success: false, message: "Token is missing or invalid" });
            return;
        }

        const verificationToken = await getVerificationTokenByToken(token);

        if (!verificationToken) {
            res.status(403).json({ success: false, message: "No verification token. Check the link or try again" });
            return;
        }

        const hasExpired = new Date(verificationToken.expires) < new Date();

        if (hasExpired) {
            res.status(403).json({ success: false, message: "Token has expired. Please request a new verification link" });
            return;
        }

        await db.user.update({
            where: { email: verificationToken.email },
            data: { emailVerified: new Date() }
        });

        await db.verificationToken.delete({ where: { id: verificationToken.id } });

        res.status(200).json({ success: true, message: "Your email is now verified" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Something went wrong! Please try again" });
    }
});

export default EmailVerificationRouter;