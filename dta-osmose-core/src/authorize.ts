//src/middlewares/authorize.ts
// src/middlewares/authorize.ts
import { expressjwt as jwt } from "express-jwt";
import { Request, Response, NextFunction, RequestHandler } from "express";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.JWT_SECRET || "";

interface JwtPayload {
  sub: number;
  role: string;
  permissions: string[];
  [key: string]: any;
}

export const authorize = (permission: string): RequestHandler[] => {
  return [
    // Authentification JWT
    jwt({
      secret,
      algorithms: ["HS256"],
      requestProperty: 'auth'
    }),
    // .unless({
    //   path: ["/auth/login"]
    // }),

    // Autorisation basée sur les permissions
    (req: Request, res: Response, next: NextFunction) => {
      const payload = req.auth as JwtPayload;
      
      if (!payload?.sub) {
        res.status(401).json({ message: "Token invalide" });
      }

      if (!payload.permissions.includes(permission)) {
        res.status(403).json({ message: "Permission insuffisante" });
      }

      next();
    }
  ];
};

export default authorize;
// import { expressjwt as jwt } from "express-jwt";
// import { Request, Response, NextFunction, RequestHandler } from "express";
// import dotenv from "dotenv";


// dotenv.config();

// const secret = process.env.JWT_SECRET || "";

// interface AuthRequest extends Request {
//     auth: {
//       id: number;
//       role: string;
//       permissions: string[];
//       [key: string]: any; // pour d'autres propriétés comme sub, iat, etc.
//     };
//   }

// function authorize(permission: string): RequestHandler[] {
//   return [
//     // Authenticate JWT token and attach user to request object (req.auth)
//     jwt({ secret, algorithms: ["HS256"] }).unless({
//       path: [
//         "/sale/:institution/sale",
//       ],
//     }) as RequestHandler,
//     // Authorize based on user permission
//     ((req: AuthRequest, res: Response, next: NextFunction) => {
//       // Type assertion for req.auth
//       const auth = (req as AuthRequest).auth;
      
//       if (!auth || !auth.permissions.includes(permission)) {
//         return res.status(401).json({ message: "Unauthorized" });
//       }
//       next();
//     }) as RequestHandler,
//   ];
// }

 //export default authorize;