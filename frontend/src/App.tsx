import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/app-pages/HomePage";
import WorkPage from "./pages/app-pages/WorkPage";
import AppLayout from "./layouts/MainLayout";
import SignInPage from "./pages/Auth/SigninPage";
import EmployeeProfile from "./pages/app-pages/Profile";
import ScrollToTop from "./utility/ScrollToTop";
import AddWorkPage from "./pages/app-pages/AddWorkPage";
import WorkAlertsListPage from "./pages/app-pages/WorkAlertPage";
import UserProtectedRoute from "./components/ProtectedRoutes/UserProtectedRoute";
import VehicleServiceAndChecklist from "./components/work/work-details";
import ChecklistPage from "./pages/app-pages/ChecklistPage";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<SignInPage />} />

        {/* Protected routes */}
        <Route
          element={
            <UserProtectedRoute>
              <AppLayout />
            </UserProtectedRoute>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/work/add" element={<AddWorkPage />} />
          <Route path="/work/:id" element={<VehicleServiceAndChecklist />} />
          <Route path="/work/:id/:checklistType" element={<ChecklistPage />} />
          <Route path="/profile" element={<EmployeeProfile />} />
          <Route path="/work-alerts" element={<WorkAlertsListPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
