import express from "express";
import userAuth from "../middleware/userAuth.js"; // ✅ default import
import { upload } from "../middleware/upload.js";
import {
  getConversations,
  getOrCreateConversationMessages,
  sendMessageToUser,
  recallMessage,
  setDisappearing
} from "../controllers/oneToOneController.js";

const router = express.Router();

// ✅ Apply authentication middleware
router.use(userAuth);

router.get("/conversations", getConversations);
router.get("/conversation/:userId", getOrCreateConversationMessages);
router.post("/conversation/:userId", upload.single("file"), sendMessageToUser); // not done
router.post("/conversation/:userId/recall/:messageId", recallMessage);
router.post("/conversation/:userId/disappearing", setDisappearing);

export default router;
