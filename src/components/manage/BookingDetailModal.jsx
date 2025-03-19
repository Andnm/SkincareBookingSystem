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
  Timeline,
  Table,
  Space,
  Form,
  Input,
  Tooltip,
  Rate
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
  DollarOutlined,
  ScheduleOutlined,
  PhoneOutlined,
  FileTextOutlined,
  LoginOutlined,
  LogoutOutlined,
  StarOutlined,
  CommentOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { getBookingDetailById } from "../../services/booking.services";
import {
  getAllBookingSlotByBookingId,
  checkInBookingSlots,
  checkOutBookingSlots,
  createNoteResultBookingSlots
} from "../../services/bookingSlot.services";
import { userSelector } from "../../redux/selectors/selector";
import { useSelector } from "react-redux";
import { ROLE_CUSTOMER, ROLE_SKINTHERAPIST, ROLE_STAFF, ROLE_MANAGER } from "../../utils/constants";
import { MdEmail, MdOutlineEmail } from "react-icons/md";
import { BsGenderAmbiguous } from "react-icons/bs";
import { createFeedbacks, createRating } from "../../services/comment.services";

const { Title, Text } = Typography;
const { TextArea } = Input;

const BookingDetailModal = ({ bookingId, visible, onClose }) => {
  const user = useSelector(userSelector);

  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [bookingSlots, setBookingSlots] = useState([]);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [noteForm] = Form.useForm();
  const [feedbackForm] = Form.useForm();

  const userRole = user?.user?.roleName;
  const isCustomer = userRole === ROLE_CUSTOMER;
  const isSkinTherapist = userRole === ROLE_SKINTHERAPIST;
  const isStaffOrManager = userRole === ROLE_STAFF || userRole === ROLE_MANAGER;

  useEffect(() => {
    fetchData();
  }, [bookingId, visible, userRole]);

  const fetchData = async () => {
    if (bookingId && visible) {
      setIsLoading(true);
      try {
        const responseBookingSlot = await getAllBookingSlotByBookingId(bookingId);
        setBookingSlots(responseBookingSlot);
        console.log("responseBookingSlot: ",responseBookingSlot)

        if (!isSkinTherapist) {
          const response = await getBookingDetailById(bookingId);
          console.log("response: ", response)
          setBookingDetails(response);
        }
      } catch (error) {
        toast.error(error.response?.data?.message);
        console.error("Error loading booking data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCheckIn = (slotId) => {
    Modal.confirm({
      title: 'Confirm Check-In',
      content: 'Are you sure you want to check in this booking slot?',
      onOk: async () => {
        setActionLoading(true);
        try {
          await checkInBookingSlots(slotId);
          toast.success('Check-in successful');
          fetchData();
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to check in');
          console.error('Check-in error:', error);
        } finally {
          setActionLoading(false);
        }
      }
    });
  };

  const handleCheckOut = (slotId) => {
    Modal.confirm({
      title: 'Confirm Check-Out',
      content: 'Are you sure you want to check out this booking slot?',
      onOk: async () => {
        setActionLoading(true);
        try {
          await checkOutBookingSlots(slotId);
          toast.success('Check-out successful');
          fetchData();
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to check out');
          console.error('Check-out error:', error);
        } finally {
          setActionLoading(false);
        }
      }
    });
  };

  const openNoteModal = (slotId) => {
    setSelectedSlotId(slotId);
    setNoteModalVisible(true);
    noteForm.resetFields();
  };

  const openFeedbackModal = (slotId) => {
    setSelectedSlotId(slotId);
    setFeedbackModalVisible(true);
    feedbackForm.resetFields();
  };

  const handleNoteSubmit = async (values) => {
    if (!selectedSlotId) return;

    setActionLoading(true);
    try {
      await createNoteResultBookingSlots(selectedSlotId, {
        content: values.content,
        description: values.description
      });
      toast.success('Note added successfully');
      setNoteModalVisible(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add note');
      console.error('Note submission error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleFeedbackSubmit = async (values) => {
    if (!selectedSlotId) return;

    setActionLoading(true);
    try {
      await createRating({
        bookingSlotId: selectedSlotId,
        star: values.rating
      });

      if (values.comment?.trim()) {
        await createFeedbacks({
          bookingSlotId: selectedSlotId,
          comment: values.comment
        });
      }

      toast.success('Thank you for your feedback!');
      setFeedbackModalVisible(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
      console.error('Feedback submission error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusTag = (status) => {
    let color = "";
    let icon = null;

    switch (status?.toLowerCase()) {
      case "done":
      case "checked-out":
        color = "green";
        icon = <CheckCircleOutlined />;
        break;
      case "in_progress":
        color = "processing";
        icon = <ClockCircleOutlined />;
        break;
      case "incomplete":
      case "cancelled":
        color = "red";
        icon = <CloseCircleOutlined />;
        break;
      case "pending":
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

  const getActionButtons = (record) => {
    const status = record.status?.toLowerCase();

    if (isStaffOrManager) {
      if (status === 'pending') {
        return (
          <Button
            type="primary"
            size="small"
            icon={<LoginOutlined />}
            loading={actionLoading}
            onClick={() => handleCheckIn(record.id)}
          >
            Check In
          </Button>
        );
      } else if (status === 'in_progress') {
        return (
          <Button
            type="primary"
            size="small"
            icon={<LogoutOutlined />}
            loading={actionLoading}
            onClick={() => handleCheckOut(record.id)}
          >
            Check Out
          </Button>
        );
      } else {
        return (
          <Tooltip title="No action available for this status">
            <Button type="default" size="small" disabled>
              {status === 'checked-out' || status === 'done' ? 'Completed' : 'No Action'}
            </Button>
          </Tooltip>
        );
      }
    } else if (isSkinTherapist) {
      if (status === 'in_progress') {
        return (
          <Button
            type="primary"
            size="small"
            icon={<FileTextOutlined />}
            onClick={() => openNoteModal(record.id)}
            loading={actionLoading}
          >
            Add Notes
          </Button>
        );
      } else {
        return (
          <Tooltip title={status === 'checked-out' || status === 'done' ? 'Session completed' : 'Patient not checked in yet'}>
            <Button type="default" size="small" disabled>
              {status === 'checked-out' || status === 'done' ? 'Completed' : 'Waiting for check-in'}
            </Button>
          </Tooltip>
        );
      }
    } else if (isCustomer) {
      if (status === 'checked-out' || status === 'done') {
        return (
          <Button
            type="primary"
            size="small"
            icon={<StarOutlined />}
            onClick={() => openFeedbackModal(record.id)}
            loading={actionLoading}
          >
            Add Feedback
          </Button>
        );
      }
    }

    return null;
  };

  const bookingSlotColumns = [
    {
      title: 'Date',
      dataIndex: 'bookingDate',
      key: 'bookingDate',
      render: (text) => text
    },
    {
      title: 'Slot',
      dataIndex: 'slotNumber',
      key: 'slotNumber',
      render: (text) => `Slot ${text}`
    },
    {
      title: 'Time',
      key: 'time',
      render: (_, record) => `${record.startTime} - ${record.endTime}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status)
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => getActionButtons(record)
    }

  ];

  return (
    <>
      <Modal
        title={<Title level={4}>Booking Details</Title>}
        open={visible}
        onCancel={onClose}
        footer={[
          <Button key="close" onClick={onClose}>
            Close
          </Button>
        ]}
        width={1000}
        style={{ top: "10px" }}
      >
        <Spin spinning={isLoading}>
          {!isSkinTherapist && bookingDetails ? (
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

                <Descriptions.Item label="Total Amount">
                  <Text strong>
                    {bookingDetails.totalAmount?.toLocaleString()} {bookingDetails.moneyUnit}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Service" >
                  <Text strong>
                    {bookingDetails.service?.name}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Created at" span={2}>
                  <Text >
                    {bookingDetails?.createdAt}
                  </Text>
                </Descriptions.Item>
              </Descriptions>

              <Divider />

              {bookingDetails.patient && (
                <>
                  <Title level={5}>Patient Information</Title>
                  <Card className="mb-4">
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <div className="flex items-center">
                          <UserOutlined className="mr-2" />
                          <div>
                            <div className="text-gray-500">Full Name</div>
                            <div>{bookingDetails.patient.fullName}</div>
                          </div>
                        </div>
                      </Col>

                      <Col span={12}>
                        <div className="flex items-center">
                          <MdOutlineEmail className="mr-2" />
                          <div>
                            <div className="text-gray-500">Email</div>
                            <div>{bookingDetails.patient.email}</div>
                          </div>
                        </div>
                      </Col>

                      <Col span={12}>
                        <div className="flex items-center">
                          <PhoneOutlined className="mr-2" />
                          <div>
                            <div className="text-gray-500">Phone</div>
                            <div>{bookingDetails.patient.phone}</div>
                          </div>
                        </div>
                      </Col>

                      <Col span={12}>
                        <div className="flex items-center">
                          <BsGenderAmbiguous className="mr-2" />
                          <div>
                            <div className="text-gray-500">Gender</div>
                            <div>{bookingDetails.patient.gender}</div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                  <Divider />
                </>
              )}

              {bookingSlots && bookingSlots.length > 0 && (
                <>
                  <Title level={5}>
                    <ScheduleOutlined className="mr-2" />
                    Booking Slots
                  </Title>
                  <Card className="mb-4">
                    <Table
                      dataSource={bookingSlots}
                      columns={bookingSlotColumns}
                      rowKey="id"
                      pagination={false}
                    />
                  </Card>
                </>
              )}
            </div>
          ) : (
            /* For SkinTherapist, only show booking slots */
            <div className="booking-details">
              {bookingSlots && bookingSlots.length > 0 ? (
                <>
                  <Title level={5}>
                    <ScheduleOutlined className="mr-2" />
                    Booking Slots
                  </Title>
                  <Card>
                    <Table
                      dataSource={bookingSlots}
                      columns={bookingSlotColumns}
                      rowKey="id"
                      pagination={false}
                    />
                  </Card>
                </>
              ) : !isLoading && (
                <div className="text-center py-8">
                  <Text type="secondary">No booking slots available</Text>
                </div>
              )}
            </div>
          )}
        </Spin>
      </Modal>

      <Modal
        title="Add Treatment Notes"
        open={noteModalVisible}
        onCancel={() => setNoteModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setNoteModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={actionLoading}
            onClick={() => noteForm.submit()}
          >
            Submit
          </Button>
        ]}
      >
        <Form
          form={noteForm}
          layout="vertical"
          onFinish={handleNoteSubmit}
        >
          <Form.Item
            name="content"
            label="Treatment Notes"
            rules={[{ required: true, message: 'Please enter treatment notes' }]}
          >
            <TextArea rows={4} placeholder="Enter detailed treatment notes" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Additional Comments"
            rules={[{ required: true, message: 'Please enter additional comments' }]}
          >
            <TextArea rows={2} placeholder="Any additional comments or recommendations" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Rate Your Experience"
        open={feedbackModalVisible}
        onCancel={() => setFeedbackModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setFeedbackModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={actionLoading}
            onClick={() => feedbackForm.submit()}
          >
            Submit Feedback
          </Button>
        ]}
      >
        <Form
          form={feedbackForm}
          layout="vertical"
          onFinish={handleFeedbackSubmit}
        >
          <Form.Item
            name="rating"
            label="Rate your experience"
            rules={[{ required: true, message: 'Please select a rating' }]}
          >
            <Rate allowHalf />
          </Form.Item>
          <Form.Item
            name="comment"
            label="Comments (Optional)"
            rules={[{ required: true, message: 'Please enter your comment' }]}
          >
            <TextArea
              rows={4}
              placeholder="Tell us about your experience. What did you like? What could be improved?"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default BookingDetailModal;