import { Router } from "express";
import { markNotificationsAsRead, getAllNotifications, getCustomerNotifications, deleteAllNotifications, deleteSingleNotifications } from "../controllers/notificationController";
import authorize from "../authorize";
const router = Router();

router.post("/mark-as-read", markNotificationsAsRead);
router.get("/:institution/all", ...authorize("view-product"), getAllNotifications);
router.get("/customer", ...authorize("view-product"), getCustomerNotifications);
router.delete("/", deleteAllNotifications);
router.delete("/:id", deleteSingleNotifications)

export default router; 