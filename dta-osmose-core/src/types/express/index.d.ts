import { JwtPayload } from "jsonwebtoken";

interface JwtUserPayload extends JwtPayload {
  sub: number;
    role: string;
    permissions: string[];
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