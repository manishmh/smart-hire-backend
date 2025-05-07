import { NextFunction, Request, Response } from "express";
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';


declare global {
    namespace Express {
        interface Request {
            user?: string | JwtPayload;
        }
    }
}

export const TokenAuthorization = (req: Request, res: Response, next: NextFunction): void => {
  const accessToken = req.cookies.accessToken || req.headers['authorization'] as string;

  if (!accessToken) {
    res.status(401).json({ success: false, message: "No access token provided" });
    return;
  }

  jwt.verify(accessToken, process.env.JWT_SECRET_TOKEN || "secret_token" as Secret, (err: any, user: any) => {
    if (err) {
      res.status(403).json({ success: false, message: "Invalid access token" });
      return;
    }

    console.log(user)
    req.user = user;
    next();
  });
};