import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getEventById, registerForEvent } from "../api/event.api";
import {
  replaceEvent,
  setSelectedEvent,
  updateRegistrationCount,
  getRegistrationCount,
} from "../redux/eventSlice";
import socket from "../socket/socket";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedEvent } = useSelector((state) => state.events);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const data = await getEventById(id);
        dispatch(setSelectedEvent(data.event));
      } catch (error) {
        setErrorMessage(error?.response?.data?.message || "Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [dispatch, id]);

  useEffect(() => {
    const handleRegistrationUpdate = ({ eventId, registrationCount }) => {
      dispatch(updateRegistrationCount({ eventId, registrationCount }));
    };

    socket.on("registrationUpdate", handleRegistrationUpdate);

    return () => {
      socket.off("registrationUpdate", handleRegistrationUpdate);
    };
  }, [dispatch]);

  const alreadyRegistered = useMemo(() => {
    if (!selectedEvent || !user) return false;

    return (selectedEvent.registrations || []).some((registeredUser) => {
      if (!registeredUser) return false;
      const registeredId =
        typeof registeredUser === "string" ? registeredUser : registeredUser._id;
      return registeredId === user._id;
    });
  }, [selectedEvent, user]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setSubmitting(true);
    setMessage("");
    setErrorMessage("");

    try {
      const data = await registerForEvent(id);
      dispatch(replaceEvent(data.event));
      dispatch(setSelectedEvent(data.event));
      setMessage("Registered successfully.");
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-center text-slate-600">Loading event...</p>;
  }

  if (errorMessage && !selectedEvent) {
    return <p className="text-center text-red-600">{errorMessage}</p>;
  }

  if (!selectedEvent) {
    return <p className="text-center text-slate-600">Event not found.</p>;
  }

  const registrationCount = getRegistrationCount(selectedEvent);

  return (
    <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            {selectedEvent.title}
          </h1>
          <p className="mt-2 text-slate-600">{selectedEvent.description}</p>
        </div>

        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
          {registrationCount} registered
        </span>
      </div>

      <div className="space-y-3 text-slate-700">
        <p>
          <span className="font-semibold">Date:</span>{" "}
          {new Date(selectedEvent.date).toLocaleString()}
        </p>
        <p>
          <span className="font-semibold">Location:</span> {selectedEvent.location}
        </p>
        {selectedEvent.createdBy?.name && (
          <p>
            <span className="font-semibold">Organizer:</span>{" "}
            {selectedEvent.createdBy.name}
          </p>
        )}
      </div>

      {message && (
        <div className="mt-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {errorMessage && selectedEvent && (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          onClick={handleRegister}
          disabled={submitting || alreadyRegistered}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {alreadyRegistered
            ? "Already Registered"
            : submitting
            ? "Registering..."
            : "Register for Event"}
        </button>

        <Link
          to="/events"
          className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
        >
          Back to Events
        </Link>
      </div>
    </div>
  );
}

export default EventDetails;