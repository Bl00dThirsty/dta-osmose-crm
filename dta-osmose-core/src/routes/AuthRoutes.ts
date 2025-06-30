import { Router } from "express";
import { login, register, logout, refreshToken} from "../controllers/AuthController";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post('/logout', logout);
router.post("/refresh-token", refreshToken);

export default router;