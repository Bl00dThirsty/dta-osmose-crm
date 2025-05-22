import { JwtPayload } from "jsonwebtoken";

interface JwtUserPayload {
    id: number;
    role: string;
    // autre chose
  }
  
  declare global {
    namespace Express {
      interface Request {
        user?: JwtUserPayload;
      }
    }
  }
  