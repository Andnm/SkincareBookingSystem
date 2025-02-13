// components/TopServices.js

import { AiOutlineBarChart, AiFillTag } from "react-icons/ai";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { PiExport } from "react-icons/pi";

const TodaySalesSummary = () => {
  const summaryData = [
    {
      icon: <AiOutlineBarChart size={24} color="white" />,
      iconBackGroundColor: "#fb597e",
      value: "$570",
      label: "Total sales",
      scale: 1.2,
      scaleType: "+",
      backGroundColor: "#ffe2e6",
    },
    {
      icon: <AiFillTag size={24} color="white" />,
      iconBackGroundColor: "#3cd856",
      value: "5",
      label: "Course sold",
      scale: 1.5,
      scaleType: "+",
      backGroundColor: "#dcfce7",
    },
    {
      icon: <BsFillPersonPlusFill size={24} color="white" />,
      iconBackGroundColor: "#bf84ff",
      value: "5",
      label: "New Customer",
      scale: 1.5,
      scaleType: "+",
      backGroundColor: "#f4e8fe",
    },
  ];

  const renderCard = (item, key) => {
    return (
      <div
        className="summary_card"
        style={{ backgroundColor: item.backGroundColor }}
        key={key}
      >
        <div
          className="summary_card_icon"
          style={{ backgroundColor: item.iconBackGroundColor }}
        >
          {item.icon}
        </div>
        <div className="summary_card_value">{item.value}</div>
        <div className="summary_card_label">{item.label}</div>
        <div className="summary_card_scale">
          {item.scaleType}
          {item.scale}% compared yesterday
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="summary_header">
        <p>Revenue today</p>
        <button>
          {" "}
          <PiExport />
          Export
        </button>
      </div>
      <div className="summary_item_container">
        {summaryData.map((item, key) => renderCard(item, key))}
      </div>
    </>
  );
};

export default TodaySalesSummary;
