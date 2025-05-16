import bcryptjs from 'bcryptjs';
import { Request, Response, Router } from 'express';
import { db } from '../../lib/db';
import { newPasswordSchema } from '../../schema/input-validation';
import { getPasswordResetTokenByToken } from '../../services/auth/passwordReset';

const NewPasswordRouter = Router();

NewPasswordRouter.post("/", async (req: Request, res: Response) => {
    try {
        const userData = req.body;
        const { token } = req.query;

        console.log('token', token)

        if (typeof token !== "string" || !token) {
            res.status(400).json({ success: false, message: "Token is missing or invalid" });
            return;
        }

        const validatedInput = newPasswordSchema.safeParse(userData);
        if (!validatedInput.success) {
            res.status(400).json({ success: false, message: validatedInput.error.errors[0].message })
            return;
        }

        const resetToken = await getPasswordResetTokenByToken(token);
        if (!resetToken) {
            res.status(404).json({ success: false, message: "Token does not exist. Try resetting again"})
            return;
        }

        const hasExpired = new Date(resetToken.expires) < new Date();
        if (hasExpired) {
            res.status(400).json({ success: false, message: "reset token has expired. Try resetting again" })
            return;
        }

        const { email } = resetToken;
        const existingUser = await db.user.findUnique({ where: { email }})
        if (!existingUser) {
            res.status(404).json({ success: false, message: "User does not exists" })
            return;
        }

        const { password } = validatedInput.data
        const hashedPassword = await bcryptjs.hash(password, 12);

        await db.user.update({
            where: { id: existingUser.id },
            data: {
                password: hashedPassword
            }
        })

        await db.passwordResetToken.delete({ where: { id: resetToken.id } })

        res.status(200).json({ success: true, message: "Password reset successfully" })
        return;

    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: "Something went wrong! try again"}) 
    }
})

export default NewPasswordRouter;