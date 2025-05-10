import { Router, Request, Response } from "express";
import { emailSchema } from "../schema/input-validation";
import { generatePasswordResetToken } from "../services/auth/generate-token";
import { db } from "../lib/db";
import { GeneratePasswordResetMail } from "../utils/mail";

const ResetPasswordRouter = Router()

ResetPasswordRouter.post("/", async (req: Request, res: Response) => {
    try {
        const userData = req.body;
        const validatedFields =  emailSchema.safeParse(userData);
    
        if (!validatedFields.success) {
            res.status(400).json({ success: false, message: validatedFields.error.errors[0].message })
            return;
        }
    
        const { email } = validatedFields.data;
    
        const existingUser = await db.user.findUnique({
            where: {
                email
            }
        })
    
        if (!existingUser) {
            res.status(404).json({ success: false, message: "User with this email does not exist" })
            return;
        }
    
        const passwordResetToken = await generatePasswordResetToken(email);
    
        const sendMail =  GeneratePasswordResetMail(
            passwordResetToken.email,
            passwordResetToken.token 
        )

        if (!sendMail) {
            res.status(400).json({ success: false, message: "coudn't send the mail" })
            return;
        }
    
        res.status(200).json({ success: true, message: "Password reset token sent successsfully", token: passwordResetToken.token });
        return;
    } catch (error) {
        console.error(error)    
        res.status(500).json({ success: false, message: "Something went wrong, try again"});
    }
})

export default ResetPasswordRouter;
