import { Router } from "express";
import { login, register, logout, refreshToken, getCurrentUser} from "../controllers/AuthController";
import { expressjwt as jwt } from "express-jwt";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

const authMiddleware = jwt({
    secret: process.env.JWT_SECRET!,
    algorithms: ["HS256"],
    requestProperty: "auth"
  });

router.post("/login", login);
router.post("/register", register);
router.post('/logout', logout);
router.post("/refresh-token", refreshToken);
router.get("/me", authMiddleware, getCurrentUser);

export default router;