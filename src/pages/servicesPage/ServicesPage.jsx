import React, { useState } from "react";
import { Input } from "antd";
import { useScrollToTop } from "../../utils/helpers";
import { list_services_data_sample } from "../../utils/constants";
import ServiceCard from "../../components/services/ServiceCard";

const { Search } = Input;

const ServicesPage = () => {
  useScrollToTop();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = list_services_data_sample.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="light-gray-background pb-20">
      <div
        className="banner-services bg-cover bg-center w-full h-[400px] relative"
        style={{
          backgroundImage:
            'url("https://mommyspa.vn/vnt_upload/service/Cham_soc_da_banner.png")',
        }}
      >
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-center bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <h2 className="text-3xl font-semibold text-blue-900">
          Skincare Services
          </h2>
        </div>
      </div>

      <div className="mt-20" />

      <div className="container">
        <div className="flex justify-center mb-10">
          <Search
            placeholder="Search for services..."
            allowClear
            enterButton="Search"
            size="large"
            className="max-w-lg w-full"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredServices.length === 0 ? (
          <p className="text-center text-gray-500 text-lg font-semibold">
            No services found
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {filteredServices.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
