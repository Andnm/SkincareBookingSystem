import React from "react";
import { Descriptions, Typography, Divider } from "antd";
import { getStatusTag } from "../../../utils/helpers";

const { Text } = Typography;


const BookingInfo = ({ bookingDetails }) => {
  if (!bookingDetails) return null;

  return (
    <>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Booking ID" span={2}>
          {bookingDetails.id}
        </Descriptions.Item>

        <Descriptions.Item label="Booking Type">
          {bookingDetails.type}
        </Descriptions.Item>

        <Descriptions.Item label="Status">
          {getStatusTag(bookingDetails.status)}
        </Descriptions.Item>

        <Descriptions.Item label="Payment Status">
          {getStatusTag(bookingDetails.paymentStatus)}
        </Descriptions.Item>

        <Descriptions.Item label="Book for Themself">
          {bookingDetails.bookForCustomerAccountOwner ? "Yes" : "No"}
        </Descriptions.Item>

        <Descriptions.Item label="Total Amount">
          <Text strong>
            {bookingDetails.totalAmount?.toLocaleString()} {bookingDetails.moneyUnit}
          </Text>
        </Descriptions.Item>
        
        <Descriptions.Item label="Service">
          <Text strong>
            {bookingDetails.service?.name}
          </Text>
        </Descriptions.Item>
        
        <Descriptions.Item label="Created at" span={2}>
          <Text>
            {bookingDetails?.createdAt}
          </Text>
        </Descriptions.Item>
      </Descriptions>
      <Divider />
    </>
  );
};

export default BookingInfo;