import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../api/auth.api";
import { clearUser } from "../redux/authSlice";
import { clearEventState } from "../redux/eventSlice";

function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      dispatch(clearUser());
      dispatch(clearEventState());
      navigate("/login");
    }
  };

  return (
    <nav className="bg-slate-900 text-white shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/events" className="text-xl font-bold tracking-wide">
          Event Dashboard
        </Link>

        <div className="flex items-center gap-4 text-sm md:text-base">
          <Link to="/events" className="hover:text-slate-300">
            Events
          </Link>

          {isAuthenticated && (
            <Link to="/dashboard" className="hover:text-slate-300">
              Dashboard
            </Link>
          )}

          {isAuthenticated && user?.role === "organizer" && (
            <Link to="/create-event" className="hover:text-slate-300">
              Create Event
            </Link>
          )}

          {!isAuthenticated ? (
            <>
              <Link to="/login" className="hover:text-slate-300">
                Login
              </Link>
              <Link
                to="/register"
                className="rounded bg-blue-600 px-3 py-1.5 hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="hidden text-slate-300 md:inline">
                {user?.name} ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="rounded bg-red-500 px-3 py-1.5 hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;