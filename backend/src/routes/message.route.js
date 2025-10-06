import express from "express"
import {
    getAllContacts,
    getChatPartners,
    getMessagesByUserId,
    sendMessage
} from "../controller/message.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router()

router.get("/contacts", protectedRoute, getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id", protectedRoute, getMessagesByUserId);
router.post("/send/:id", protectedRoute, sendMessage);

export default router