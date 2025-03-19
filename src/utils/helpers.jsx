import React, { useEffect } from "react";
import { FaCalendarAlt, FaHistory, FaInfo, FaUser } from "react-icons/fa";
import { RiBookletLine, RiCalendarScheduleLine } from "react-icons/ri";
import { MdOutlineMedicalServices, MdOutlinePassword } from "react-icons/md";
import { AiOutlineDashboard } from "react-icons/ai";
import { toast } from "react-toastify";
import { ROLE_CUSTOMER, ROLE_MANAGER, ROLE_SKINTHERAPIST, ROLE_STAFF } from "./constants";
import { GrTransaction } from "react-icons/gr";
import { GoPerson } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";

export function formatDateTimeVN(isoString) {
  const date = new Date(isoString);

  const options = {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: false,
    timeZone: "Asia/Ho_Chi_Minh",
  };

  const formatter = new Intl.DateTimeFormat("vi-VN", options);
  const formattedParts = formatter.formatToParts(date);

  const time = `${formattedParts.find((p) => p.type === "hour").value}:${formattedParts.find((p) => p.type === "minute").value
    }`;

  const dateStr = `${formattedParts.find((p) => p.type === "day").value}/${formattedParts.find((p) => p.type === "month").value
    }/${formattedParts.find((p) => p.type === "year").value}`;

  return `${time} | ${dateStr}`;
}

export const sliderMenu = [
  {
    key: "dashboard",
    icon: <AiOutlineDashboard />,
    label: "Dashboard",
    roles: [ROLE_MANAGER],
  },
  {
    key: "manage-accounts",
    icon: <GoPerson />,
    label: "Accounts",
    roles: [ROLE_MANAGER],
  },
  {
    key: "manage-services",
    icon: <MdOutlineMedicalServices />,
    label: "Services",
    roles: [ROLE_MANAGER],
  },
  {
    key: "manage-bookings",
    icon: <RiBookletLine />,
    label: "Bookings",
    roles: [ROLE_MANAGER, ROLE_STAFF],
  },
  {
    key: "manage-working-schedule",
    icon: <RiCalendarScheduleLine />,
    label: "Working Schedule",
    roles: [ROLE_MANAGER, ROLE_STAFF],
  },
  {
    key: "manage-transactions",
    icon: <GrTransaction />,
    label: "Transactions",
    roles: [ROLE_MANAGER, ROLE_STAFF],
  },
  {
    key: "settings",
    icon: <IoSettingsOutline />,
    label: "Settings",
    roles: [ROLE_MANAGER],
  },
  //customer, skin therapist
  {
    key: "/account-history",
    icon: <FaHistory />,
    label: "History of Booking",
    roles: [ROLE_CUSTOMER, ROLE_SKINTHERAPIST],
  },
  {
    key: "/account-working-schedule",
    icon: <FaCalendarAlt />,
    label: "Working Schedule",
    roles: [ROLE_SKINTHERAPIST],
  }
];

export const sliderMenuHeader = [
  {
    key: "/account",
    icon: <FaUser />,
    label: "Profile",
    roles: [ROLE_CUSTOMER, ROLE_SKINTHERAPIST],
  },
  {
    key: "/account-history",
    icon: <FaHistory />,
    label: "History of Booking",
    roles: [ROLE_CUSTOMER, ROLE_SKINTHERAPIST],
  },
  {
    key: "/account-working-schedule",
    icon: <FaCalendarAlt />,
    label: "Working Schedule",
    roles: [ROLE_SKINTHERAPIST],
  }
];

export const filterMenuByRole = (menu, role) => {
  if (!role) return [];
  return menu.filter((item) => item.roles.some((r) => r.name === role.name));
};

export function useScrollToTop() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
}

export const handleActionNotSupport = () => {
  toast.warning("This feature is not supported yet!");
};

export const handleLowerCaseNonAccentVietnamese = (str) => {
  str = str.toLowerCase();

  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
  return str;
};

export const generateFallbackAvatar = (fullName) => {
  const fallbackColor = "#FF9966";

  const initials = handleLowerCaseNonAccentVietnamese(
    fullName?.charAt(0).toUpperCase() || ""
  );

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100">
      <rect width="100%" height="100%" fill="${fallbackColor}" />
      <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-size="50">
        ${initials}
      </text>
    </svg>
  `;
  const dataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
  return dataUrl;
};

export const toastError = (error) => {
  const messages = error?.response?.data?.message;

  if (Array.isArray(messages)) {
    const combinedMessage = messages.join("\n");
    toast.error(combinedMessage);
  } else {
    toast.error(messages || error.message || "An error occurred");
  }
};
