import React from "react";
import { useNavigate } from "react-router-dom";

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/services/${service.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white cursor-pointer rounded-lg shadow-lg p-4 transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:bg-blue-50"
    >
      <img
        alt="img services"
        className="h-40 w-full object-cover rounded-md mb-4"
        src={service.imageURL}
        loading="lazy"
      />
      <h2 className="text-center text-lg font-semibold text-blue-900 hover:text-blue-600 capitalize">
        {service.name}
      </h2>
    </div>
  );
};

export default ServiceCard;