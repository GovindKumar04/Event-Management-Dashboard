import Event from "../models/Event.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const getAllEvents = async () => {
  return Event.find()
    .populate("createdBy", "name email role")
    .populate("registrations", "name email")
    .sort({ date: 1, createdAt: -1 });
};

export const getEventById = async (eventId) => {
  const event = await Event.findById(eventId)
    .populate("createdBy", "name email role")
    .populate("registrations", "name email");

  if (!event) {
    throw createError("Event not found", 404);
  }

  return event;
};

export const createEvent = async ({ title, description, date, location, userId }) => {
  if (!title || !description || !date || !location) {
    throw createError("Title, description, date, and location are required", 400);
  }

  const event = await Event.create({
    title,
    description,
    date,
    location,
    createdBy: userId,
  });

  return Event.findById(event._id)
    .populate("createdBy", "name email role")
    .populate("registrations", "name email");
};

export const registerForEvent = async ({ eventId, userId }) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw createError("Event not found", 404);
  }

  const alreadyRegistered = event.registrations.some(
    (registrationUserId) => registrationUserId.toString() === userId.toString()
  );

  if (alreadyRegistered) {
    throw createError("You have already registered for this event", 400);
  }

  event.registrations.push(userId);
  await event.save();

  return Event.findById(event._id)
    .populate("createdBy", "name email role")
    .populate("registrations", "name email");
};

export const getEventsCreatedByOrganizer = async (userId) => {
  return Event.find({ createdBy: userId })
    .populate("createdBy", "name email role")
    .populate("registrations", "name email")
    .sort({ createdAt: -1 });
};

export const getEventsRegisteredByUser = async (userId) => {
  return Event.find({ registrations: userId })
    .populate("createdBy", "name email role")
    .populate("registrations", "name email")
    .sort({ date: 1 });
};