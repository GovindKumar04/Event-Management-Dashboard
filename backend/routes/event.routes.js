import express from "express";
import {
  getEvents,
  getSingleEvent,
  createEvent,
  registerEvent,
  getMyCreatedEvents,
  getMyRegisteredEvents,
} from "../controllers/event.controller.js";
import { protect, requireOrganizer } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getEvents);
router.get("/organizer/mine", protect, requireOrganizer, getMyCreatedEvents);
router.get("/user/registered", protect, getMyRegisteredEvents);
router.get("/:id", getSingleEvent);

router.post("/", protect, requireOrganizer, createEvent);
router.post("/:id/register", protect, registerEvent);

export default router;