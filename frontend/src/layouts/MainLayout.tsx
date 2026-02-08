// src/layouts/MainLayout.tsx
import { type ReactNode } from "react";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import Header from "../components/ui/Header";

// Static imports for icons (normal + active/green versions)
import homeIcon from "../assets/icons/home.png";
import homeActiveIcon from "../assets/icons/home-active.png";
import workIcon from "../assets/icons/work.png";
import workActiveIcon from "../assets/icons/work-active.png";
import alertsIcon from "../assets/icons/alerts.png";
import alertsActiveIcon from "../assets/icons/alerts-active.png";
import profileIcon from "../assets/icons/profile.png";
import profileActiveIcon from "../assets/icons/profile-active.png";

interface MainLayoutProps {
  children?: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth,
  );

  // Show loading screen while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600 mb-4"></div>
        <p className="text-gray-600 font-medium">Checking authentication...</p>
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      {/* Scrollable main content – Outlet renders the child route here */}
      <main className="flex-1 pb-24 pt-4 px-4 overflow-y-auto">
        <Outlet />
        {children}
      </main>

      {/* Fixed bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t overflow-y-hidden border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] z-50 flex items-center justify-around max-h-20">
        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-1/4 h-full text-xs font-medium transition-colors ${isActive ? "text-green-600" : "text-gray-600"}`
          }
        >
          {({ isActive }) => (
            <>
              <img
                src={isActive ? homeActiveIcon : homeIcon}
                alt="Home"
                className={`w-7 h-7 mb-1 object-contain transition-transform duration-150 ${isActive ? "scale-110" : "scale-100"}`}
              />
              <span>Home</span>
            </>
          )}
        </NavLink>

        {/* Work */}
        <NavLink
          to="/work"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-1/4 h-full text-xs font-medium transition-colors ${isActive ? "text-green-600" : "text-gray-500"}`
          }
        >
          {({ isActive }) => (
            <>
              <img
                src={isActive ? workActiveIcon : workIcon}
                alt="Work"
                className={`w-7 h-7 mb-1 object-contain transition-transform duration-150 ${isActive ? "scale-110" : "scale-100"}`}
              />
              <span>Work</span>
            </>
          )}
        </NavLink>

        {/* Alerts */}
        <NavLink
          to="/work-alerts"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-1/4 h-full text-xs font-medium transition-colors ${isActive ? "text-green-600" : "text-gray-500"}`
          }
        >
          {({ isActive }) => (
            <>
              <img
                src={isActive ? alertsActiveIcon : alertsIcon}
                alt="Alerts"
                className={`w-7 h-7 mb-1 object-contain transition-transform duration-150 ${isActive ? "scale-110" : "scale-100"}`}
              />
              <span>Alerts</span>
            </>
          )}
        </NavLink>

        {/* Profile */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-1/4 h-full text-xs font-medium transition-colors ${isActive ? "text-green-600" : "text-gray-500"}`
          }
        >
          {({ isActive }) => (
            <>
              <img
                src={isActive ? profileActiveIcon : profileIcon}
                alt="Profile"
                className={`w-7 h-7 mb-1 object-contain transition-transform duration-150 ${isActive ? "scale-110" : "scale-100"}`}
              />
              <span>Profile</span>
            </>
          )}
        </NavLink>
      </nav>
    </div>
  );
}
