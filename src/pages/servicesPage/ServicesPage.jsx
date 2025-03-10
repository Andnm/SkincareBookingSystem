import React, { useState, useEffect } from "react";
import { Input, Spin } from "antd";
import { useScrollToTop } from "../../utils/helpers";
import { getAllServices } from "../../services/service.services";
import ServiceCard from "../../components/services/ServiceCard";

const { Search } = Input;

const ServicesPage = () => {
  useScrollToTop();
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchServices = async (name = "") => {
    try {
      setLoading(true);
      setError(null);
      const params = name ? { Name: name } : {};
      
      const response = await getAllServices(params);
      console.log("response: ", response.data)
      setServices(response.data || []); 
    } catch (err) {
      setError("Failed to fetch services");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSearch = () => {
    fetchServices(searchTerm);
  };

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={handleSearch}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <Spin size="large" />
          </div>
        ) : error ? (
          <p className="text-center text-red-500 text-lg font-semibold">
            {error}
          </p>
        ) : services.length === 0 ? (
          <p className="text-center text-gray-500 text-lg font-semibold">
            No services found
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {services.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;