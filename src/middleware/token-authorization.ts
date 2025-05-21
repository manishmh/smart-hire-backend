import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { AuthUserPayload } from "../types/express";

export const TokenAuthorization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.accessToken || (req.headers["authorization"] as string);

  if (!accessToken) {
    res
      .status(401)
      .json({ success: false, message: "No access token provided" });
    return;
  }

  jwt.verify(
    accessToken,
    process.env.JWT_SECRET_TOKEN || "default_token", 
    (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
      if (err || !decoded) {
        res
          .status(403)
          .json({ success: false, message: "Invalid access token" });
        return;
      }

      console.log(decoded)
      req.user = decoded as AuthUserPayload;
      next();
    }
  );

};
