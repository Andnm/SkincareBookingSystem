import React from "react";
import logo from "../../../assets/images/logo.png";
import logo_mat_bang from "../../../assets/images/logo_mat_bang.png";
import logo_nha_dat from "../../../assets/images/logo_nha_dat.png";
import logo_phong_kham from "../../../assets/images/logo_phong_kham.png";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaTiktok,
  FaCommentDots,
  FaYoutube,
} from "react-icons/fa";
import { RiFacebookCircleFill } from "react-icons/ri";

function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
          <img
            alt="SMART logo"
            className="mb-3"
            height="50"
            src={logo}
            width="200"
            loading="lazy"
          />

          <div className="flex space-x-4 mt-2">
            <img
              alt="Clinic logo"
              height="60"
              src={logo_phong_kham}
              width="60"
              loading="lazy"
            />
            <img
              alt="Real estate logo"
              height="60"
              src={logo_nha_dat}
              width="60"
              loading="lazy"
            />
            <img
              alt="New premises logo"
              height="60"
              src={logo_mat_bang}
              width="60"
              loading="lazy"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-16">
          <div>
            <h3 className="text-blue-800 font-bold mb-4">INFORMATION</h3>
            <ul className="text-gray-700 space-y-2">
              <li className="hover:text-blue-600 cursor-pointer transition">
                Terms & Commitments
              </li>
              <li className="hover:text-blue-600 cursor-pointer transition">
                Operating Regulations
              </li>
              <li className="hover:text-blue-600 cursor-pointer transition">
                Complaint Resolution
              </li>
              <li className="hover:text-blue-600 cursor-pointer transition">
                Privacy Policy
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-blue-800 font-bold mb-4">SYSTEM</h3>
            <ul className="text-gray-700 space-y-2">
              <li className="hover:text-blue-600 cursor-pointer transition">
                For Experts
              </li>
              <li className="hover:text-blue-600 cursor-pointer transition">
                Pricing
              </li>
              <li className="hover:text-blue-600 cursor-pointer transition">
                User Guide
              </li>
              <li className="hover:text-blue-600 cursor-pointer transition">
                VNPAY Payment Guide
              </li>
              <li className="hover:text-blue-600 cursor-pointer transition">
                Contact Us
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-blue-800 font-bold mb-4">CONNECT WITH US</h3>
            <ul className="text-gray-700 space-y-3">
              {[
                { icon: <FaPhoneAlt />, text: "0123456789" },
                {
                  icon: <FaEnvelope />,
                  text: "skincarebookingsystem@gmail.com",
                },
                {
                  icon: <RiFacebookCircleFill />,
                  text: "skincarebookingsystem",
                },
                { icon: <FaTiktok />, text: "skincarebookingsystem" },
                { icon: <FaCommentDots />, text: "0123456789" },
                { icon: <FaYoutube />, text: "@skincarebookingsystem" },
              ].map((item, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-800">
                    {item.icon}
                  </div>
                  <span className="hover:text-blue-600 cursor-pointer transition">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
