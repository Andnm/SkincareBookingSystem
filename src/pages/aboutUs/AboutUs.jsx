import React, { useState } from "react";
import { about_us_tool } from "../../utils/constants";

const AboutUs = () => {
  const [selectedOption, setSelectedOption] = useState("about-us");

  return (
    <>
      {/* Button Switch */}
      <div className="flex justify-center gap-20 py-8">
        <button
          onClick={() => setSelectedOption("about-us")}
          className={`${
            selectedOption === "about-us"
              ? "bg-blue-900 text-white"
              : "bg-white text-blue-900 border border-blue-900"
          } cursor-pointer py-2 px-6 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-900 hover:text-white`}
        >
          Introduction
        </button>
        <button
          onClick={() => setSelectedOption("policy")}
          className={`${
            selectedOption === "policy"
              ? "bg-blue-900 text-white"
              : "bg-white text-blue-900 border border-blue-900"
          } cursor-pointer py-2 px-6 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-900 hover:text-white`}
        >
          Privacy Policy
        </button>
      </div>

      {selectedOption === "about-us" && (
        <div className="max-w-[1000px] mx-auto pb-10 ">
          <h1 className="uppercase text-blue-900 text-2xl text-center font-bold">
            SYSTEM – VIETNAMESE BEAUTY CARE
          </h1>
          <p className="mt-5">
            Established in 2013, Spa with 10 years of experience in the field of
            care and treatment of problems: Acne - Dark spots - Scars. From a
            spa to a Dermatology Clinic, Spa has constantly upgraded its
            services, space and equipment to bring the best experiences to
            customers.{" "}
          </p>
          <p className="mt-5">
            Successfully treated more than 4,000,000 customers. Continuously
            expanding and developing to optimize customer experience and
            efficiency.
          </p>
          <iframe
            className="w-full h-150 mt-5"
            src="https://www.youtube.com/embed/WjOsA5ndXvQ?si=E448wmMm68NI0vCD"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />

          <p className="mt-5">
            The Spa currently has a total of 25 branches in Ho Chi Minh City,
            stretching from the Central to the South to be able to serve and
            accompany all customers in the process of treating acne in all
            regions. In order to meet the beauty needs of brothers and sisters
            in all regions of the country.
          </p>

          <p className="mt-5">
            <span className="uppercase text-blue-900 font-bold">
              ALL OUT – DEDICATED – ACCOMPANYING
            </span>{" "}
            Is the criterion that Spa wants to aim at customers
          </p>

          <h1 className="uppercase text-blue-900 text-2xl text-center font-bold mt-5">
            MODERN FACILITIES WITH 5-STAR STANDARDS
          </h1>

          <div className="grid grid-cols-4 gap-4">
            <img src="https://gaspa.vn/wp-content/uploads/2023/04/h7-247x247.jpeg" />
            <img src="https://gaspa.vn/wp-content/uploads/2023/04/h6-247x247.jpeg" />
            <img src="https://gaspa.vn/wp-content/uploads/2023/04/h1-247x247.jpeg" />
            <img src="https://gaspa.vn/wp-content/uploads/2023/04/h2-247x247.jpeg" />
          </div>

          <ul className="list-inside pl-4 space-y-3 text-gray-700">
            <li className="flex items-start space-x-2">
              <span className="text-blue-500">•</span>
              <p>
                All treatment beds at the Spa are designed independently and
                discreetly, providing a private space and the most comfort for
                customers when experiencing the services at the Spa.
              </p>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-500">•</span>
              <p>
                The technology system is always fully equipped from basic to
                advanced. At the same time, the world's leading new and modern
                technologies are always updated and applied to the services at
                the Spa.
              </p>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-500">•</span>
              <p>
                A chain of comfortable lounges will surely satisfy customers.
              </p>
            </li>
          </ul>

          <h1 className="uppercase text-blue-900 text-2xl text-center font-bold mt-5">
            STANDARD MEDICAL SERVICE PROCEDURE{" "}
          </h1>

          <p className="mt-5 text-center">
            Spa Dermatology Clinic is licensed to operate by the Department of
            Health
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
            {about_us_tool.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden transition-transform duration-300"
              >
                <img
                  src={item.img_link}
                  alt={item.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-blue-900 text-center">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedOption === "policy" && (
        <div className="max-w-[1000px] mx-auto pb-10 ">
          <p className="font-semibold">
            Spa Dermatology Clinic thanks you for visiting the website. We
            understand that the peace of mind of all customers in storing and
            securing personal information is very important. Therefore, the Spa
            strictly implements a customer information security policy and uses
            appropriate measures to protect customer information from
            unauthorized access.
          </p>

          <p className="mt-5">
            This privacy policy explains how we receive, store, use and secure
            customer information during the use of the website. The privacy
            policy may be changed and supplemented at any time to suit the
            development of the service as well as changes in the relevant legal
            system. The change will take effect immediately upon posting on the
            website. Customers are requested to always check to receive the most
            accurate information.
          </p>

          <p className="mt-5 font-semibold">
            1. Purpose and scope of information collection
          </p>
          <p className="mt-5">
            {" "}
            When registering to receive promotional information from the Spa's
            website or when you want to exchange, receive direct consultation
            from a doctor or when you use products and services at the Spa. We
            will collect your personal information such as: Full name, email
            address, phone number, ID card, images, sounds, work content, ...
            All will be done by recording and storing information at our data
            center.
          </p>
          <p className="mt-5">
            {" "}
            We will use the information you provide to provide services and
            information as requested by you. We also use your information to
            improve the quality of our services, improve the layout and content
            of the website to suit users, identify visitors to the website, and
            send information about products or services to you. If you do not
            want to receive information from us, you can refuse at any time.
          </p>
          <p className="mt-5 font-semibold">2. Security</p>
          <p className="mt-5">
            {" "}
            To protect customer information and ensure customer information
            security is paramount, we have appropriate technical and security
            measures to prevent unauthorized access, or destruction, damage to
            your information. Your personal information will be collected by us
            on secure servers, centrally stored, backed up, and encrypted.
            Information administrators and related employees have limited access
            and must strictly comply with security standards.
          </p>
          <p className="mt-5">
            You do not use any program, tool or other form to interfere with the
            system or change the data structure. It is strictly forbidden to
            disseminate, propagate or encourage any activity to interfere,
            sabotage or infiltrate the data of the website system. Any violation
            will result in the deprivation of all rights and will be prosecuted
            before the law if necessary.
          </p>
          <p className="mt-5 font-semibold">3. Sharing information</p>
          <p className="mt-5">
            Spa knows that customer information is a very important part in
            service development, so we do not sell or exchange customer
            information to any third party. Except in the following cases,
            customer information may be shared with third parties:
          </p>
          <p className="mt-5"> – With customer consent to share.</p>
          <p className="mt-5">
            {" "}
            – When required by a competent law enforcement agency and this is
            necessary and appropriate to comply with legal requirements.
          </p>
          <p className="mt-5">
            {" "}
            – When such information is required to protect the rights, property
            or safety of us, our customers, other individuals/organizations
            involved in exchanging information to prevent fraud and reduce
            risks.
          </p>
          <p className="mt-5">
            {" "}
            – When such information is required to be provided for comparison or
            clarification with a third party to ensure the accuracy of the
            information.
          </p>
          <p className="mt-5 font-semibold">4. Customer rights</p>
          <p className="mt-5">
            {" "}
            Customers have the right to access their personal data, the right to
            request that we correct any errors in your data free of charge. You
            also have the right to request that we stop using your personal
            information for marketing purposes at any time.
          </p>
          <p className="mt-5 italic">
            Spa Dermatology Clinic would like to thank you for trusting and
            using our services!
          </p>
          <p className="mt-5 italic">
            **Note: Results may vary depending on individual body type.
          </p>
        </div>
      )}
    </>
  );
};

export default AboutUs;
