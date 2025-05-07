import jwt, { Secret } from 'jsonwebtoken';

export const generateAccessToken = (email: string) => {
    const accessToken = jwt.sign(
        { 
            sub: email, 
            iat: Math.floor(Date.now() / 1000)
        }, 
        process.env.JWT_SECRET_TOKEN || "secret_token" as Secret,
        {
            expiresIn: '15m'
        }
    )

    return accessToken;
}

export const generateRefreshToken = (email: string) => {
    const refreshToken = jwt.sign(
        { 
            sub: email, 
            iat: Math.floor(Date.now() / 1000)
        }, 
        process.env.JWT_SECRET_TOKEN || "secret_token" as Secret,
        {
            expiresIn: '30d'
        }
    )

    return refreshToken;
}