import { v4 as uuidv4 } from 'uuid'
import { getPasswordResetTokenByMail } from './passwordReset';
import { db } from '../../lib/db';

export const generatePasswordResetToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + (6.5 * 60 * 60 * 1000 ))

    const existingToken = await getPasswordResetTokenByMail(email);

    if (existingToken) {
        await db.passwordResetToken.delete({
            where: {
                id:  existingToken.id
            }
        })
    }

    const passwordResetToken = db.passwordResetToken.create({
        data: {
            email,
            token,
            expires
        }
    })

    return passwordResetToken;
}