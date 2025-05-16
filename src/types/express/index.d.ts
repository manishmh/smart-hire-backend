import { Role } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

export interface AuthUserPayload {
  id: string,
  email?: string
  role: Role
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload
    }
  }
}
