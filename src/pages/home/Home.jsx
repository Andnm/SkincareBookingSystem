import React, { useEffect, useState } from "react";
import banner_img from "../../assets/images/banner.png";
import { FaDollarSign, FaFilter, FaStar } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import {
  hot_blogs,
  list_customer_successful,
  list_services_data_sample,
  services_carousel,
} from "../../utils/constants";
import { Carousel, Image } from "antd";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
  IoMdHeart,
} from "react-icons/io";
import { getRandomRating } from "../../utils/common";
import { useNavigate } from "react-router-dom";
import ServiceCard from "../../components/services/ServiceCard";

const Home = () => {
  const navigate = useNavigate();
  const displayedRooms = list_services_data_sample.slice(0, 8);

  return (
    <div className="home-page light-gray-background relative">
      {/* banner */}
      <div
        className="banner-container bg-cover bg-center w-full h-[700px] relative"
        style={{ backgroundImage: `url(${banner_img})` }}
      />

      {/* MAIN CONTENT */}
      {/* ////////////////// */}
      <div className="mt-10"></div>

      {/* list services */}
      <div className="container">
        <div className="px-10 py-10 bg-white rounded-md">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 uppercase">
            Hot services
          </h2>
          {list_services_data_sample.length === 0 ? (
            <p className="text-center text-gray-500 text-lg font-semibold">
              No services available
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {displayedRooms.map((service, index) => (
                <ServiceCard key={index} service={service} />
              ))}

              {list_services_data_sample.length > 8 && (
                <button
                  className="cursor-pointer mt-4 w-fit px-6 py-3 border-2 border-blue-800 text-blue-800 font-bold rounded-md hover:bg-blue-100 flex items-center"
                  onClick={() => {
                    navigate("/services");
                  }}
                >
                  View all <span className="ml-2">→</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-10"></div>
      {/* list customer */}
      <div className="container">
        <div className="px-10 py-10 bg-white rounded-md">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 uppercase">
            Successful treatment customers
          </h2>
          {list_customer_successful.length === 0 ? (
            <p className="text-center text-gray-500 text-lg font-semibold">
              Không tồn tại khách hàng thành công nào cả
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {list_customer_successful.map((img_link, index) => (
                <div
                  className="bg-white cursor-pointer rounded-lg h-fit shadow-lg overflow-hidden"
                  key={index}
                >
                  <Image
                    alt="services"
                    className="h-full w-full object-cover rounded-lg"
                    src={img_link}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* experience-dorn */}
      <div className="experience-dorn my-8 p-8">
        <h2 className="uppercase text-white font-semibold text-center text-xl">
          Experience the service with KOLs
        </h2>

        <div className="container">
          <Carousel
            dots={false}
            arrows
            prevArrow={
              <IoIosArrowDropleftCircle className="text-blue-800" size={20} />
            }
            nextArrow={
              <IoIosArrowDroprightCircle className="text-blue-800" size={20} />
            }
            speed={400}
            slidesToShow={4}
            slidesToScroll={1}
            infinite={services_carousel.length > 4}
            className="my-6"
            autoplay
            autoplaySpeed={3000}
          >
            {services_carousel.map((room) => (
              <div className="" key={room._id}>
                <div className="bg-white rounded-md text-black p-1 shadow-md hover:shadow-lg transition duration-300 mx-2">
                  <img
                    src={room.img_links[0]}
                    alt={room.title}
                    className="h-140 w-full object-cover rounded-md mb-2"
                    loading="lazy"
                  />

                  <div className="px-2">
                    <h3 className="text-lg truncate" title={room.title}>
                      {room.title}
                    </h3>

                    <p className="text-md mt-1 text-gray-400">
                      From:{" "}
                      <span className="font-semibold text-orange-500">
                        {room.price.toLocaleString()} VND
                      </span>
                    </p>

                    <div className="flex justify-between items-center mb-4 mt-2">
                      <div className="cursor-pointer rounded-md flex justify-center items-center gap-1 bg-gray-100 p-2">
                        <FaStar className="text-orange-500" />
                        <p>{getRandomRating()}</p>
                      </div>

                      <div className="">
                        <IoMdHeart
                          className="cursor-pointer text-gray-400"
                          size={25}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        <div className="flex justify-center">
          <button
            className="cursor-pointer mt-4 px-6 py-3 bg-white text-blue-800 font-bold rounded-md flex items-center transition duration-300 hover:bg-blue-400 hover:text-white hover:shadow-md"
            onClick={() => {}}
          >
            View more
          </button>
        </div>
      </div>

      <div className="mt-10"></div>

      {/* hot news */}
      <div className="container pt-6 pb-10">
        <h2 className="text-2xl font-bold text-blue-800 uppercase">
          Blogs outstanding
        </h2>

        <div className="grid grid-cols-4 gap-4 cursor-pointer mt-6">
          {hot_blogs.map((news_item, index) => (
            <div
              key={index}
              className="flex flex-col rounded-lg bg-white pb-2 hover:shadow-lg hover:scale-105 transition-transform duration-200"
              style={{
                minWidth: "200px",
              }}
            >
              <img
                src={news_item.img_link}
                alt={news_item.title}
                className="w-full h-[300px] object-cover rounded-t-lg mb-2"
                loading="lazy"
              />

              <div className="flex flex-row px-2 py-2 items-center">
                <p className="text-2xl font-bold text-gray-500">
                  {index < 10 ? `0${index + 1}` : index + 1}
                </p>
                <h3 className="text-lg font-semibold px-4 line-clamp-2">
                  {news_item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
