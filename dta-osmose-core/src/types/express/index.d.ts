import { JwtPayload } from "jsonwebtoken";

interface JwtUserPayload {
    id: number;
    role: string;
    permissions: string[];
    email?: string;
  }
  
  declare global {
    namespace Express {
      interface Request {
        user: JwtUserPayload;
      }
    }
  }
  export {}; 