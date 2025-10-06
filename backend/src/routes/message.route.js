import express from "express"
import {
    getAllContacts,
    getChatPartners,
    getMessagesByUserId,
    sendMessage
} from "../controller/message.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router()
router.use(protectedRoute)
router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id", getMessagesByUserId);
router.post("/send/:id", sendMessage);

export default router