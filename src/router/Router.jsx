import { Route, Routes } from "react-router-dom";
import Home from "../pages/home/Home";
import NotFound from "../pages/notFound/NotFound";
import AuthLayout from "../components/layout/AuthLayout";
import ChangePassword from "../pages/account/ChangePassword";
import Dashboard from "../pages/admin/Dashboard";
import AdminLayout from "../components/layout/AdminLayout";
import ForgotPassword from "../pages/forgotPassword/ForgotPassword";
import ServicesPage from "../pages/servicesPage/ServicesPage";
import AboutUs from "../pages/aboutUs/AboutUs";
import TestPage from "../pages/testPage/TestPage";
import SkinTherapist from "../pages/skinTherapist/SkinTherapist";
import Blogs from "../pages/blog/Blogs";
import BlogDetail from "../pages/blogDetail/BlogDetail";
import Schedule from "../pages/schedule/Schedule";
import ManageAccount from "../pages/admin/ManageAccount";
import ManageTransaction from "../pages/admin/ManageTransaction";
import ManageBooking from "../pages/admin/ManageBooking";
import Account from "../pages/account";
import ManageService from "../pages/admin/ManageService";

const Router = () => {
  return (
    <Routes>
      {/* <Route element={<UnAuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/show-component" element={<ShowComponent />} />
      </Route> */}

      <Route element={<AuthLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<Account />} />
        <Route path="/account/change-password" element={<ChangePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/skin-therapist" element={<SkinTherapist />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/schedule" element={<Schedule />} />
      </Route>

      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/accounts" element={<ManageAccount />} />
        <Route path="/services" element={<ManageService />} />
        <Route path="/transactions" element={<ManageTransaction />} />
        <Route path="/bookings" element={<ManageBooking />} />
      </Route>
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
