import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "../api/auth.api";
import { clearUser, setAuthChecked, setUser } from "../redux/authSlice";
import Navbar from "../components/Navbar";
import RoutesConfig from "./routes";

function App() {
  const dispatch = useDispatch();
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await getCurrentUser();
        dispatch(setUser(data.user));
      } catch (error) {
        dispatch(clearUser());
      } finally {
        dispatch(setAuthChecked(true));
        setBooting(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (booting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-lg text-slate-600">Loading application...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-8">
          <RoutesConfig />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;