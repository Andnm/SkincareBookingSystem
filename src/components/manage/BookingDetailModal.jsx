import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Descriptions,
  Spin,
  Divider,
  Typography,
  Tag,
  Card,
  Row,
  Col,
  List,
  Timeline
} from "antd";
import { toast } from "react-toastify";
import { 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  CreditCardOutlined,
  UserOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  DollarOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { getBookingDetailById } from "../../services/booking.services";

const { Title, Text } = Typography;

const BookingDetailModal = ({ bookingId, visible, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (bookingId && visible) {
        setIsLoading(true);
        try {
          const response = await getBookingDetailById(bookingId);
          setBookingDetails(response);
        } catch (error) {
          toast.error("Failed to load booking details!");
          toast.error(error.response?.data?.message);
          console.error("Error loading booking details:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchBookingDetails();
  }, [bookingId, visible]);

  const getStatusTag = (status) => {
    let color = "";
    let icon = null;
    
    switch (status?.toLowerCase()) {
      case "done":
        color = "green";
        icon = <CheckCircleOutlined />;
        break;
      case "incomplete":
        color = "red";
        icon = <CloseCircleOutlined />;
        break;
      default:
        color = "blue";
        icon = <ClockCircleOutlined />;
    }
    
    return (
      <Tag color={color} icon={icon}>
        {status}
      </Tag>
    );
  };

  return (
    <Modal
      title={<Title level={4}>Booking Details</Title>}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
        bookingDetails?.paymentURL && (
          <Button
            key="payment"
            type="primary"
            onClick={() => window.open(bookingDetails.paymentURL, "_blank")}
          >
            Go to Payment
          </Button>
        ),
      ]}
      width={800}
    >
      <Spin spinning={isLoading}>
        {bookingDetails ? (
          <div className="booking-details">
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
              
              <Descriptions.Item label="Total Amount" span={2}>
                <Text strong>
                  {bookingDetails.totalAmount?.toLocaleString()} {bookingDetails.moneyUnit}
                </Text>
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            {bookingDetails.bookingDetails && (
              <>
                <Title level={5}>Booking Details</Title>
                <Card className="mb-4">
                  <Row gutter={[16, 16]}>
                    {bookingDetails.bookingDetails.checkInDate && (
                      <Col span={12}>
                        <div className="flex items-center">
                          <CalendarOutlined className="mr-2" />
                          <div>
                            <div className="text-gray-500">Check-in Date</div>
                            <div>{dayjs(bookingDetails.bookingDetails.checkInDate).format("DD/MM/YYYY")}</div>
                          </div>
                        </div>
                      </Col>
                    )}
                    
                    {bookingDetails.bookingDetails.checkOutDate && (
                      <Col span={12}>
                        <div className="flex items-center">
                          <CalendarOutlined className="mr-2" />
                          <div>
                            <div className="text-gray-500">Check-out Date</div>
                            <div>{dayjs(bookingDetails.bookingDetails.checkOutDate).format("DD/MM/YYYY")}</div>
                          </div>
                        </div>
                      </Col>
                    )}
                    
                    {bookingDetails.bookingDetails.location && (
                      <Col span={24}>
                        <div className="flex items-center">
                          <EnvironmentOutlined className="mr-2" />
                          <div>
                            <div className="text-gray-500">Location</div>
                            <div>{bookingDetails.bookingDetails.location}</div>
                          </div>
                        </div>
                      </Col>
                    )}
                  </Row>
                </Card>
              </>
            )}

            {bookingDetails.customer && (
              <>
                <Title level={5}>Customer Information</Title>
                <Card className="mb-4">
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <div className="flex items-center">
                        <UserOutlined className="mr-2" />
                        <div>
                          <div className="text-gray-500">Name</div>
                          <div>{bookingDetails.customer.name}</div>
                        </div>
                      </div>
                    </Col>
                    
                    <Col span={12}>
                      <div className="flex items-center">
                        <UserOutlined className="mr-2" />
                        <div>
                          <div className="text-gray-500">Email</div>
                          <div>{bookingDetails.customer.email}</div>
                        </div>
                      </div>
                    </Col>
                    
                    <Col span={12}>
                      <div className="flex items-center">
                        <UserOutlined className="mr-2" />
                        <div>
                          <div className="text-gray-500">Phone</div>
                          <div>{bookingDetails.customer.phone}</div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </>
            )}

            {bookingDetails.payment && (
              <>
                <Title level={5}>Payment Information</Title>
                <Card className="mb-4">
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <div className="flex items-center">
                        <DollarOutlined className="mr-2" />
                        <div>
                          <div className="text-gray-500">Payment Method</div>
                          <div>{bookingDetails.payment.method}</div>
                        </div>
                      </div>
                    </Col>
                    
                    <Col span={12}>
                      <div className="flex items-center">
                        <CalendarOutlined className="mr-2" />
                        <div>
                          <div className="text-gray-500">Payment Date</div>
                          <div>
                            {bookingDetails.payment.date 
                              ? dayjs(bookingDetails.payment.date).format("DD/MM/YYYY HH:mm") 
                              : "Not paid yet"}
                          </div>
                        </div>
                      </div>
                    </Col>
                    
                    <Col span={12}>
                      <div className="flex items-center">
                        <CreditCardOutlined className="mr-2" />
                        <div>
                          <div className="text-gray-500">Transaction ID</div>
                          <div>{bookingDetails.payment.transactionId || "N/A"}</div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </>
            )}

            {bookingDetails.history && bookingDetails.history.length > 0 && (
              <>
                <Title level={5}>Booking History</Title>
                <Timeline mode="left">
                  {bookingDetails.history.map((item, index) => (
                    <Timeline.Item 
                      key={index}
                      color={
                        item.status === "cancelled" 
                          ? "red" 
                          : item.status === "completed" 
                            ? "green" 
                            : "blue"
                      }
                      label={dayjs(item.date).format("DD/MM/YYYY HH:mm")}
                    >
                      {item.action} {item.description && `- ${item.description}`}
                    </Timeline.Item>
                  ))}
                </Timeline>
              </>
            )}

            {bookingDetails.items && bookingDetails.items.length > 0 && (
              <>
                <Title level={5}>Items & Services</Title>
                <List
                  bordered
                  dataSource={bookingDetails.items}
                  renderItem={item => (
                    <List.Item>
                      <div className="flex justify-between w-full">
                        <div>
                          <Text strong>{item.name}</Text>
                          {item.description && (
                            <div className="text-gray-500">{item.description}</div>
                          )}
                        </div>
                        <div>
                          <Text strong>{item.price?.toLocaleString()} {bookingDetails.moneyUnit}</Text>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </>
            )}
          </div>
        ) : !isLoading && (
          <div className="text-center py-8">
            <Text type="secondary">No booking details available</Text>
          </div>
        )}
      </Spin>
    </Modal>
  );
};

export default BookingDetailModal;