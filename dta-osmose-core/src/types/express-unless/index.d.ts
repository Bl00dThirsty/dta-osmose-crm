import { JwtPayload } from "jsonwebtoken";

interface JwtUserPayload extends JwtPayload {
  sub: number;
    role: string;
    permissions: string[];
    userType: "user" | "customer";
    email?: string;
  }
  
  declare global {
    namespace Express {
      interface Request {
        auth: JwtUserPayload;
      }
    }
  }
  export {}; 