import asyncHandler from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
import { getIO } from "../config/socket.js";
import {
  getAllEvents,
  getEventById,
  createEvent as createEventService,
  registerForEvent,
  getEventsCreatedByOrganizer,
  getEventsRegisteredByUser,
} from "../services/event.service.js";

export const getEvents = asyncHandler(async (req, res) => {
  const events = await getAllEvents();

  res.status(200).json({
    success: true,
    events,
  });
});

export const getSingleEvent = asyncHandler(async (req, res) => {
  const event = await getEventById(req.params.id);

  res.status(200).json({
    success: true,
    event,
  });
});

export const createEvent = asyncHandler(async (req, res) => {
  const event = await createEventService({
    ...req.body,
    userId: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Event created successfully",
    event,
  });
});

export const registerEvent = asyncHandler(async (req, res) => {
  const event = await registerForEvent({
    eventId: req.params.id,
    userId: req.user._id,
  });

  try {
    await sendEmail({
      to: req.user.email,
      subject: `Registration confirmed: ${event.title}`,
      text: `Hi ${req.user.name}, you have successfully registered for ${event.title} on ${new Date(
        event.date
      ).toLocaleString()} at ${event.location}.`,
      html: `
        <h2>Registration Confirmed</h2>
        <p>Hi ${req.user.name},</p>
        <p>You have successfully registered for <strong>${event.title}</strong>.</p>
        <p><strong>Date:</strong> ${new Date(event.date).toLocaleString()}</p>
        <p><strong>Location:</strong> ${event.location}</p>
      `,
    });
  } catch (emailError) {
    console.warn("Email sending failed:", emailError.message);
  }

  try {
    const io = getIO();
    io.emit("registrationUpdate", {
      eventId: event._id,
      registrationCount: event.registrations.length,
    });
  } catch (socketError) {
    console.warn("Socket emit failed:", socketError.message);
  }

  res.status(200).json({
    success: true,
    message: "Registered successfully",
    event,
  });
});

export const getMyCreatedEvents = asyncHandler(async (req, res) => {
  const events = await getEventsCreatedByOrganizer(req.user._id);

  res.status(200).json({
    success: true,
    events,
  });
});

export const getMyRegisteredEvents = asyncHandler(async (req, res) => {
  const events = await getEventsRegisteredByUser(req.user._id);

  res.status(200).json({
    success: true,
    events,
  });
});