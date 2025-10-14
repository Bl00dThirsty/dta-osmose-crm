import { Router } from "express";
import { markNotificationsAsRead, getAllNotifications, getCustomerNotifications, deleteSingleNotifications } from "../controllers/notificationController";
import authorize from "../authorize";
const router = Router();

router.post("/mark-as-read", markNotificationsAsRead);
router.get("/:institution/all", ...authorize("readAll-notification"), getAllNotifications);
router.get("/customer", ...authorize("readAll-notificationCustomer"), getCustomerNotifications);

router.delete("/:id", authorize("delete-notification"), deleteSingleNotifications)

export default router; 