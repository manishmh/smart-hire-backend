import jwt, { Secret } from 'jsonwebtoken';
import { Role } from '@prisma/client'; 

type TokenUser = {
  id: string;
  email: string;
  role: Role;
};

export const generateAccessToken = (tokenUser: TokenUser) => {
  const accessToken = jwt.sign(
    tokenUser,
    process.env.JWT_SECRET_TOKEN || "secret_token" as Secret,
    { expiresIn: '15m' }
  );
  return accessToken;
};

export const generateRefreshToken = (tokenUser: TokenUser) => {
  const refreshToken = jwt.sign(
    tokenUser,
    process.env.JWT_SECRET_TOKEN || "secret_token" as Secret,
    { expiresIn: '30d' }
  );
  return refreshToken;
};
