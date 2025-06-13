// middleware/authMiddleware.ts
// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// const secret = process.env.JWT_SECRET || "ton_secret";

// export const authenticate = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, secret) as {
//       sub: number;
//       role: string;
//       permissions?: string[];
//       email?: string;
//     };

//     req.user = {
//       id: decoded.sub,
//       role: decoded.role,
//       permissions: decoded.permissions,
//       email: decoded.email
//     };

//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };
