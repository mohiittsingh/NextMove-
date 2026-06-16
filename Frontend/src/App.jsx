import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import About from "./pages/About.jsx";
import AdminAuth from "./pages/AdminAuth.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Auth from "./pages/Auth.jsx";
import Contact from "./pages/Contact.jsx";
import DriverAuth from "./pages/DriverAuth.jsx";
import DriverDashboard from "./pages/DriverDashboard.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import RoleSelect from "./pages/RoleSelect.jsx";
import RouteDetails from "./pages/RouteDetails.jsx";
import Safety from "./pages/Safety.jsx";
import UserHome from "./pages/UserHome.jsx";

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<RoleSelect />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin/auth" element={<AdminAuth />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/route/:id" element={<RouteDetails />} />
        <Route path="/driver/auth" element={<DriverAuth />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
        <Route path="/user/home" element={<UserHome />} />
        <Route path="/legacy-login" element={<Login />} />
      </Routes>
    </AnimatePresence>
  );
}
