import React from "react";
import "./styles.scss";
import Header from "../../common/Header/Header";
import Footer from "../../common/Footer/Footer";
import { Outlet } from "react-router-dom";
import { TfiHeadphoneAlt } from "react-icons/tfi";

function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <Header />
      <main className="">
        <Outlet />
      </main>
      <Footer />

      <div className="fixed bottom-10 right-5 w-12 h-12 bg-blue-300 flex items-center justify-center rounded-full shadow-lg hover:bg-blue-400 hover:scale-110 transition cursor-pointer">
        <TfiHeadphoneAlt className="text-white text-xl" />
      </div>
    </div>
  );
}

export default AuthLayout;
