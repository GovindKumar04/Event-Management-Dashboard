import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrganizerEvents,
  getRegisteredEvents,
} from "../api/event.api";
import EventCard from "../components/EventCard";
import {
  setMyEvents,
  setRegisteredEvents,
  updateRegistrationCount,
} from "../redux/eventSlice";
import socket from "../socket/socket";

function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myEvents, registeredEvents } = useSelector((state) => state.events);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        if (user?.role === "organizer") {
          const data = await getOrganizerEvents();
          dispatch(setMyEvents(data.events));
        } else {
          const data = await getRegisteredEvents();
          dispatch(setRegisteredEvents(data.events));
        }
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message || "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [dispatch, user]);

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
    return <p className="text-center text-slate-600">Loading dashboard...</p>;
  }

  if (errorMessage) {
    return <p className="text-center text-red-600">{errorMessage}</p>;
  }

  if (user?.role === "organizer") {
    const totalRegistrations = myEvents.reduce((total, event) => {
      return total + (event.registrationCount ?? event.registrations?.length ?? 0);
    }, 0);

    return (
      <div>
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Organizer Dashboard
            </h1>
            <p className="mt-2 text-slate-600">
              Manage your events and track registrations.
            </p>
          </div>

          <Link
            to="/create-event"
            className="inline-block rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            Create New Event
          </Link>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">Total Events</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              {myEvents.length}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">Total Registrations</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              {totalRegistrations}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">Role</p>
            <h2 className="mt-2 text-3xl font-bold capitalize text-slate-800">
              {user.role}
            </h2>
          </div>
        </div>

        {myEvents.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow">
            <p className="text-slate-600">You have not created any events yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {myEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">User Dashboard</h1>
        <p className="mt-2 text-slate-600">
          View all events you have registered for.
        </p>
      </div>

      {registeredEvents.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow">
          <p className="text-slate-600">
            You have not registered for any events yet.
          </p>
          <Link
            to="/events"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Explore Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {registeredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;