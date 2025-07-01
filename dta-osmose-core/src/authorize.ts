
import { expressjwt as jwt } from "express-jwt";
import { Request, Response, NextFunction, RequestHandler } from "express";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.JWT_SECRET || "";

interface JwtPayload {
  sub: number;
  role: string;
  permissions?: string[];
  userType: "user" | "customer";
  [key: string]: any;
}

export const authorize = (permission: string): RequestHandler[] => {
  return [
    // Middleware d'authentification JWT
    jwt({
      secret,
      algorithms: ["HS256"],
      requestProperty: "auth"
    }),

    // Middleware d'autorisation
    (req: Request, res: Response, next: NextFunction) => {
      const payload = req.auth as JwtPayload;

      if (!payload?.sub) {
         res.status(401).json({ message: "Token invalide" });
      }

      // Si le userType est 'customer' et que tu veux limiter leur accès à certaines routes
      if (payload.userType === "customer") {
        if (!payload.permissions?.includes(permission)) {
           res.status(403).json({ message: "Permission insuffisante (customer)" });
        }
      }

      // Cas normal pour les users
      if (payload.userType === "user") {
        if (!payload.permissions?.includes(permission)) {
           res.status(403).json({ message: "Permission insuffisante (user)" });
        }
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

// interface JwtPayload {
//   sub: number;
//   role: string;
//   permissions: string[];
//   [key: string]: any;
// }

// export const authorize = (permission: string): RequestHandler[] => {
//   return [
//     // Authentification JWT
//     jwt({
//       secret,
//       algorithms: ["HS256"],
//       requestProperty: 'auth'
//     }),
//     // .unless({
//     //   path: ["/auth/login"]
//     // }),

//     // Autorisation basée sur les permissions
//     (req: Request, res: Response, next: NextFunction) => {
//       const payload = req.auth as JwtPayload;
      
//       if (!payload?.sub) {
//         res.status(401).json({ message: "Token invalide" });
//       }

//       if (!payload.permissions.includes(permission)) {
//         res.status(403).json({ message: "Permission insuffisante" });
//       }

//       next();
//     }
//   ];
// };

// export default authorize;
