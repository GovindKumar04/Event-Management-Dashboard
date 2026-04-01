import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEvents } from "../api/event.api";
import EventCard from "../components/EventCard";
import { setEvents, updateRegistrationCount } from "../redux/eventSlice";
import socket from "../socket/socket";

function Events() {
  const dispatch = useDispatch();
  const { events } = useSelector((state) => state.events);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getEvents();
        dispatch(setEvents(data.events));
      } catch (error) {
        setErrorMessage(error?.response?.data?.message || "Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [dispatch]);

  useEffect(() => {
    const handleRegistrationUpdate = ({ eventId, registrationCount }) => {
      dispatch(updateRegistrationCount({ eventId, registrationCount }));
    };

    socket.on("registrationUpdate", handleRegistrationUpdate);

    return () => {
      socket.off("registrationUpdate", handleRegistrationUpdate);
    };
  }, [dispatch]);

  if (loading) {
    return <p className="text-center text-slate-600">Loading events...</p>;
  }

  if (errorMessage) {
    return <p className="text-center text-red-600">{errorMessage}</p>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">All Events</h1>
        <p className="mt-2 text-slate-600">
          Browse events and register with real-time updates.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow">
          <p className="text-slate-600">No events available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;