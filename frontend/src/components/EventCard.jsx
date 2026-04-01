import { Link } from "react-router-dom";
import { getRegistrationCount } from "../redux/eventSlice";

function EventCard({ event }) {
  const registrationCount = getRegistrationCount(event);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-xl font-semibold text-slate-800">{event.title}</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          {registrationCount} registered
        </span>
      </div>

      <p className="mb-4 line-clamp-3 text-sm text-slate-600">
        {event.description}
      </p>

      <div className="space-y-1 text-sm text-slate-600">
        <p>
          <span className="font-medium text-slate-800">Date:</span>{" "}
          {new Date(event.date).toLocaleString()}
        </p>
        <p>
          <span className="font-medium text-slate-800">Location:</span>{" "}
          {event.location}
        </p>
        {event.createdBy?.name && (
          <p>
            <span className="font-medium text-slate-800">Organizer:</span>{" "}
            {event.createdBy.name}
          </p>
        )}
      </div>

      <div className="mt-5">
        <Link
          to={`/events/${event._id}`}
          className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default EventCard;