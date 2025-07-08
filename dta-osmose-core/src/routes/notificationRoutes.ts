import { Router } from "express";
import { markNotificationsAsRead, getAllNotifications, deleteAllNotifications, deleteSingleNotifications } from "../controllers/notificationController";

const router = Router();

router.post("/mark-as-read", markNotificationsAsRead);
router.get("/all", getAllNotifications);
router.delete("/", deleteAllNotifications);
router.delete("/:id", deleteSingleNotifications)

export default router; 