import bcryptjs from 'bcryptjs';
import { Request, Response, Router } from "express";
import { db } from "../lib/db";
import { registerSchema } from "../schema/input-validation";

const RegisterRouter = Router();

RegisterRouter.post("/", async (req: Request, res: Response) => {
    try {
        const userData = req.body;
    
        const existingUser = await db.user.findUnique({
            where: {
                email: userData.email.trim()
            }
        })
    
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "User with this email already exists."
            })
        }

        const verifiedSchema = registerSchema.safeParse(userData);
    
        if (!verifiedSchema.success) {
            res.status(400).json({
                success: false,
                message: verifiedSchema.error.errors[0].message, 
            });
            return
        }
    
        const { name, email, password } = verifiedSchema.data 
    
        const hashedPassword = await bcryptjs.hash(password, 12);
    
        await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })
        
        res.status(200).json({ success: true, message: "User created successfully"})
        
    } catch (error) {
        console.error(error) 
        res.status(500).json({ success: false, message: "Something went wrong, try again"})
    }
})

export default RegisterRouter;