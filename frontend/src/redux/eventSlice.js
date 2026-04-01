import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  events: [],
  selectedEvent: null,
  myEvents: [],
  registeredEvents: [],
};

const normalizeCount = (event) => {
  if (typeof event?.registrationCount === "number") {
    return event.registrationCount;
  }

  if (Array.isArray(event?.registrations)) {
    return event.registrations.length;
  }

  return 0;
};

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setEvents: (state, action) => {
      state.events = action.payload;
    },
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },
    setMyEvents: (state, action) => {
      state.myEvents = action.payload;
    },
    setRegisteredEvents: (state, action) => {
      state.registeredEvents = action.payload;
    },
    addEvent: (state, action) => {
      state.events.unshift(action.payload);
      state.myEvents.unshift(action.payload);
    },
    updateRegistrationCount: (state, action) => {
      const { eventId, registrationCount } = action.payload;

      state.events = state.events.map((event) =>
        event._id === eventId
          ? {
              ...event,
              registrationCount,
              registrations: Array(registrationCount).fill(null),
            }
          : event
      );

      state.myEvents = state.myEvents.map((event) =>
        event._id === eventId
          ? {
              ...event,
              registrationCount,
              registrations: Array(registrationCount).fill(null),
            }
          : event
      );

      state.registeredEvents = state.registeredEvents.map((event) =>
        event._id === eventId
          ? {
              ...event,
              registrationCount,
              registrations: Array(registrationCount).fill(null),
            }
          : event
      );

      if (state.selectedEvent && state.selectedEvent._id === eventId) {
        state.selectedEvent = {
          ...state.selectedEvent,
          registrationCount,
          registrations: Array(registrationCount).fill(null),
        };
      }
    },
    replaceEvent: (state, action) => {
      const updatedEvent = action.payload;

      state.events = state.events.map((event) =>
        event._id === updatedEvent._id ? updatedEvent : event
      );

      state.myEvents = state.myEvents.map((event) =>
        event._id === updatedEvent._id ? updatedEvent : event
      );

      state.registeredEvents = state.registeredEvents.map((event) =>
        event._id === updatedEvent._id ? updatedEvent : event
      );

      if (state.selectedEvent && state.selectedEvent._id === updatedEvent._id) {
        state.selectedEvent = updatedEvent;
      }
    },
    clearEventState: (state) => {
      state.events = [];
      state.selectedEvent = null;
      state.myEvents = [];
      state.registeredEvents = [];
    },
  },
});

export const {
  setEvents,
  setSelectedEvent,
  setMyEvents,
  setRegisteredEvents,
  addEvent,
  updateRegistrationCount,
  replaceEvent,
  clearEventState,
} = eventSlice.actions;

export const getRegistrationCount = (event) => normalizeCount(event);

export default eventSlice.reducer;