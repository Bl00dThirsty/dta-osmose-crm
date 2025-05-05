//src/middleware/authorize.ts
import { expressjwt as jwt } from "express-jwt";
//var { expressjwt: jwt } = require("express-jwt");
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";


dotenv.config();

const secret = process.env.JWT_SECRET || "";

interface AuthRequest extends Request {
    auth?: {
      permissions: string[];
      [key: string]: any; // pour d'autres propriétés comme sub, iat, etc.
    };
  }

function authorize(permission: string) {
  return [
    // Authenticate JWT token and attach user to request object (req.auth)
    jwt({ secret, algorithms: ["HS256"] }),
    // Authorize based on user permission
    (req: AuthRequest, res: Response, next: NextFunction) => {
      // Type assertion for req.auth
      const auth = req.auth;

      if (!auth || !auth.permissions.includes(permission)) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      next();
    },
  ];
}

export default authorize;
