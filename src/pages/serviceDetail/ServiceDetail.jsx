import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getServiceDetailById } from "../../services/service.services";
import { Spin, Carousel, Tag, Button, message, Breadcrumb } from "antd";
import {
  ClockCircleOutlined,
  DollarCircleOutlined,
  SkinOutlined,
  MedicineBoxOutlined,
  HomeOutlined
} from "@ant-design/icons";
import { useScrollToTop } from "../../utils/helpers";

const ServiceDetail = () => {
  useScrollToTop();
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        const response = await getServiceDetailById(id);
        setService(response);
        setLoading(false);
      } catch (error) {
        message.error("Failed to fetch service details");
        setLoading(false);
      }
    };

    fetchServiceDetail();
  }, [id]);

  const formatPrice = (price) => {
    const numberString = String(price);
    const numberArray = numberString.split("");
    const dotPosition = numberArray.length % 3 || 3;
    for (let i = dotPosition; i < numberArray.length; i += 4) {
      numberArray.splice(i, 0, ".");
    }
    const formattedNumber = numberArray.join("");
    return formattedNumber;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center text-xl text-gray-500 my-20">
        Service not found
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-4 pb-10">

      <Breadcrumb className="">
        <Breadcrumb.Item onClick={() => navigate('/')}>
          <HomeOutlined />
          <span>Home</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => navigate('/services')}>
          Services
        </Breadcrumb.Item>
        <Breadcrumb.Item>{service.name}</Breadcrumb.Item>
      </Breadcrumb>

      <div className="grid md:grid-cols-2 gap-10 mt-4">
        <div>
          <Carousel autoplay>
            {service.imageURLs.map((imageUrl, index) => (
              <div key={index} className="h-[500px]">
                <img
                  src={imageUrl}
                  alt={`Service ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </Carousel>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-blue-900 mb-6">
            {service.name}
          </h1>

          <div className="space-y-4 mb-6">
            <p className="text-gray-600 text-lg">{service.description}</p>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <ClockCircleOutlined className="text-blue-600" />
                <span>
                  Duration: {service.duration} {service.durationUnit}
                </span>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <DollarCircleOutlined className="text-green-600" />
                <span>
                  Price: <span className="text-red-700 font-bold">{formatPrice(service.price)} {service.moneyUnit}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Skin Types */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 flex items-center">
              <SkinOutlined className="mr-2 text-blue-600" />
              Suitable Skin Types
            </h3>
            <div className="flex flex-wrap gap-2">
              {service.skinTypes.map(type => (
                <Tag key={type.id} color="blue">{type.name}</Tag>
              ))}
            </div>
          </div>

          {/* Skin Issues */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 flex items-center">
              <MedicineBoxOutlined className="mr-2 text-green-600" />
              Addresses Skin Issues
            </h3>
            <div className="flex flex-wrap gap-2">
              {service.skinIssues.map(issue => (
                <Tag key={issue.id} color="green">{issue.name}</Tag>
              ))}
            </div>
          </div>

          <Button
            type="primary"
            size="large"
            className="w-full"
            onClick={() => {
              navigate("/schedule", {
                state: {
                  service: {
                    id: service.id,
                    name: service.name
                  }
                }
              })
            }}
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;