import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import SignupSeeker from "./pages/SignupSeeker";
import SignupConsultant from "./pages/SignupConsultant";
import EditProfileConsultant from "./pages/EditProfileConsultant";
import EditProfileSeeker from "./pages/EditProfileSeeker";
import ViewSchedule from "./pages/ViewSchedule";
import UpdateRates from "./pages/UpdateRates";
import FindConsultants from "./pages/FindConsultants";
import MyBookings from "./pages/MyBookings";
import PublicConsultantSearch from "./pages/PublicConsultantSearch";
import ConsultantProfile from "./pages/ConsultantProfile";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminConsultants from "./pages/AdminConsultants";
import AdminSeekers from "./pages/AdminSeekers";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminManagement from "./pages/AdminManagement";
import AdminSettings from "./pages/AdminSettings";
import AdminLogs from "./pages/AdminLogs";
import BookConsultant from "./pages/BookConsultant";
import BookingConfirmation from "./pages/BookingConfirmation";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ManageAvailability from "./pages/ManageAvailability";
import AboutUs from "./pages/AboutUs";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import ConsultantPublicProfile from "./pages/ConsultantPublicProfile";
import ConsultantProfileSettingsPage from "./pages/ConsultantProfileSettingsPage";
import ServiceBookings from "./pages/ServiceBookings";
import SeekerServiceBookings from "./pages/SeekerServiceBookings";
import ConsultantDirectory from "./pages/ConsultantDirectory";
import NotFound from "./pages/NotFound";

export const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/signup/seeker",
    element: <SignupSeeker />,
  },
  {
    path: "/signup/consultant",
    element: <SignupConsultant />,
  },
  // Profile Management Routes
  {
    path: "/edit-profile/consultant",
    element: <EditProfileConsultant />,
  },
  {
    path: "/edit-profile/seeker",
    element: <EditProfileSeeker />,
  },
  {
    path: "/view-schedule",
    element: <ViewSchedule />,
  },
  {
    path: "/update-rates",
    element: <UpdateRates />,
  },
  {
    path: "/manage-availability",
    element: <ManageAvailability />,
  },
  {
    path: "/find-consultants",
    element: <FindConsultants />,
  },
  {
    path: "/my-bookings",
    element: <MyBookings />,
  },
  // Authenticated Search Route (for logged-in seekers)
  {
    path: "/search-consultants",
    element: <FindConsultants />,
  },
  // Public Search Routes (for non-logged-in users)
  {
    path: "/public/search",
    element: <PublicConsultantSearch />,
  },
  // Consultant Profile Routes
  {
    path: "/consultant/:id",
    element: <ConsultantProfile />,
  },
  {
    path: "/consultant/:id/public",
    element: <PublicConsultantSearch />, // Will be replaced with dedicated profile page
  },
  // Admin Routes
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/consultants",
    element: <AdminConsultants />,
  },
  {
    path: "/admin/seekers",
    element: <AdminSeekers />,
  },
  {
    path: "/admin/analytics",
    element: <AdminAnalytics />,
  },
  {
    path: "/admin/admins",
    element: <AdminManagement />,
  },
  {
    path: "/admin/settings",
    element: <AdminSettings />,
  },
  {
    path: "/admin/logs",
    element: <AdminLogs />,
  },
  // Booking Routes
  {
    path: "/book/:consultantId",
    element: <BookConsultant />,
  },
  {
    path: "/booking-confirmation/:bookingId",
    element: <BookingConfirmation />,
  },
  // Content Pages
  {
    path: "/about",
    element: <AboutUs />,
  },
  {
    path: "/testimonials",
    element: <Testimonials />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
  {
    path: "/privacy",
    element: <Privacy />,
  },
  // Consultant Profile Routes
  {
    path: "/consultants",
    element: <ConsultantDirectory />,
  },
  {
    path: "/consultants/:username",
    element: <ConsultantPublicProfile />,
  },
  {
    path: "/consultant-profile-settings",
    element: <ConsultantProfileSettingsPage />,
  },
  {
    path: "/service-bookings",
    element: <ServiceBookings />,
  },
  {
    path: "/seeker-service-bookings",
    element: <SeekerServiceBookings />,
  },
  // 404 route - catch all unmatched routes
  {
    path: "*",
    element: <NotFound />,
  },
];
