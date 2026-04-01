import api from "./axios";

export const getEvents = async () => {
  const response = await api.get("/events");
  return response.data;
};

export const getEventById = async (id) => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

export const createEvent = async (data) => {
  const response = await api.post("/events", data);
  return response.data;
};

export const registerForEvent = async (id) => {
  const response = await api.post(`/events/${id}/register`);
  return response.data;
};

export const getOrganizerEvents = async () => {
  const response = await api.get("/events/organizer/mine");
  return response.data;
};

export const getRegisteredEvents = async () => {
  const response = await api.get("/events/user/registered");
  return response.data;
};