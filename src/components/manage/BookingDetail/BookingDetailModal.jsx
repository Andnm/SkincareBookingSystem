import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Spin,
  Typography,
  Card,
  Table,
} from "antd";
import { toast } from "react-toastify";
import { ScheduleOutlined } from "@ant-design/icons";
import { 
  getBookingDetailById,
  cancelBookingByBookingId 
} from "../../../services/booking.services";
import {
  getAllBookingSlotByBookingId,
  checkInBookingSlots,
  checkOutBookingSlots,
  createNoteResultBookingSlots,
  getBookingSlotDetailByBookingSlotId
} from "../../../services/bookingSlot.services";
import { userSelector } from "../../../redux/selectors/selector";
import { useSelector } from "react-redux";
import { ROLE_CUSTOMER, ROLE_SKINTHERAPIST, ROLE_STAFF, ROLE_MANAGER } from "../../../utils/constants";
import { createFeedbacks, createRating } from "../../../services/comment.services";

// Import sub-components
import BookingHeader from "./BookingHeader";
import BookingInfo from "./BookingInfo";
import PatientInfo from "./PatientInfo";
import TreatmentNoteModal from "./TreatmentNoteModal";
import FeedbackModal from "./FeedbackModal";
import BookingSlotTable from "./BookingSlotTable";

const { Title, Text } = Typography;

const BookingDetailModal = ({ bookingId, visible, onClose, onBookingUpdated }) => {
  const user = useSelector(userSelector);

  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [bookingSlots, setBookingSlots] = useState([]);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [slotDetails, setSlotDetails] = useState({});
  const [canCancel, setCanCancel] = useState(false);

  const userRole = user?.user?.roleName;
  const isCustomer = userRole === ROLE_CUSTOMER;
  const isSkinTherapist = userRole === ROLE_SKINTHERAPIST;
  const isStaffOrManager = userRole === ROLE_STAFF || userRole === ROLE_MANAGER;

  useEffect(() => {
    fetchData();
    
    if (!visible) {
      setSlotDetails({});
      setExpandedRowKeys([]);
    }
  }, [bookingId, visible, userRole]);

  const fetchData = async () => {
    if (bookingId && visible) {
      setIsLoading(true);
      try {
        const responseBookingSlot = await getAllBookingSlotByBookingId(bookingId);
        setBookingSlots(responseBookingSlot);

        if (!isSkinTherapist) {
          const response = await getBookingDetailById(bookingId);
          setBookingDetails(response);
          
          checkCancelEligibility(response, responseBookingSlot);
        }
      } catch (error) {
        toast.error(error.response?.data?.message);
        console.error("Error loading booking data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const checkCancelEligibility = (bookingData, slots) => {
    if (!bookingData || !isCustomer) {
      setCanCancel(false);
      return;
    }

    if (bookingData.status?.toLowerCase() === 'cancel') {
      setCanCancel(false);
      return;
    }

    if (slots && slots.length > 0) {
      const now = new Date();
      
      let foundEligibleSlot = false;
      
      for (const slot of slots) {
        if (slot.bookingDate) {
          const parts = slot.bookingDate.split('/');
          const bookingDate = new Date(parts[2], parts[1] - 1, parts[0]);
          
          const oneDayFromNow = new Date(now);
          oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);
          
          if (bookingDate > oneDayFromNow) {
            foundEligibleSlot = true;
            break;
          }
        }
      }
      
      setCanCancel(foundEligibleSlot);
    } else {
      setCanCancel(false);
    }
  };

  const handleCancelBooking = () => {
    Modal.confirm({
      title: 'Confirm booking cancellation',
      content: 'Are you sure you want to cancel this booking?',
      okText: 'Confirm',
      cancelText: 'No',
      onOk: async () => {
        setActionLoading(true);
        try {
          const responseCancel = await cancelBookingByBookingId(bookingId);
          toast.success('Booking canceled successfully');
          
          if (onBookingUpdated) {
            onBookingUpdated(bookingId, 'Cancel');
          }
          
          fetchData();
        } catch (error) {
          toast.error(error.response?.data?.message || 'Booking cannot be cancelled.');
          console.error('Cancel booking error:', error);
        } finally {
          setActionLoading(false);
        }
      }
    });
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
  };

  const openFeedbackModal = (slotId) => {
    setSelectedSlotId(slotId);
    setFeedbackModalVisible(true);
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
      
      if (expandedRowKeys.includes(selectedSlotId)) {
        try {
          const updatedSlotDetail = await getBookingSlotDetailByBookingSlotId(selectedSlotId);
          setSlotDetails(prevDetails => ({
            ...prevDetails,
            [selectedSlotId]: updatedSlotDetail
          }));
        } catch (error) {
          console.error("Error refreshing slot details:", error);
        }
      }
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
      
      if (expandedRowKeys.includes(selectedSlotId)) {
        try {
          const updatedSlotDetail = await getBookingSlotDetailByBookingSlotId(selectedSlotId);
          setSlotDetails(prevDetails => ({
            ...prevDetails,
            [selectedSlotId]: updatedSlotDetail
          }));
        } catch (error) {
          console.error("Error refreshing slot details:", error);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
      console.error('Feedback submission error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const fetchSlotDetails = async (slotId) => {
    try {
      setActionLoading(true);
      const slotDetail = await getBookingSlotDetailByBookingSlotId(slotId);
      setSlotDetails(prevDetails => ({
        ...prevDetails,
        [slotId]: slotDetail
      }));
      return slotDetail;
    } catch (error) {
      console.error("Error fetching slot details:", error);
      toast.error("Failed to load details for this booking slot");
      return null;
    } finally {
      setActionLoading(false);
    }
  };

  const onExpandRow = async (expanded, record) => {
    const keys = expanded 
      ? [...expandedRowKeys, record.id] 
      : expandedRowKeys.filter(key => key !== record.id);
    
    setExpandedRowKeys(keys);
    
    if (expanded && record.status?.toLowerCase() === 'done') {
      await fetchSlotDetails(record.id);
    }
  };

  const getFooterButtons = () => {
    const buttons = [
      <Button key="close" onClick={onClose}>
        Close
      </Button>
    ];

    if (isCustomer && canCancel) {
      buttons.unshift(
        <Button key="cancel" danger onClick={handleCancelBooking} loading={actionLoading}>
          Cancel Booking
        </Button>
      );
    }

    return buttons;
  };

  return (
    <>
      <Modal
        title={<BookingHeader />}
        open={visible}
        onCancel={onClose}
        footer={getFooterButtons()}
        width={1000}
        style={{ top: "10px" }}
      >
        <Spin spinning={isLoading}>
          {!isSkinTherapist && bookingDetails ? (
            <div className="booking-details">
              <BookingInfo bookingDetails={bookingDetails} />

              {bookingDetails.patient && (
                <PatientInfo patient={bookingDetails.patient} />
              )}

              {bookingSlots && bookingSlots.length > 0 && (
                <>
                  <Title level={5}>
                    <ScheduleOutlined className="mr-2" />
                    Booking Slots
                  </Title>
                  <Card className="mb-4">
                    <BookingSlotTable
                      bookingSlots={bookingSlots}
                      expandedRowKeys={expandedRowKeys}
                      onExpandRow={onExpandRow}
                      slotDetails={slotDetails}
                      handleCheckIn={handleCheckIn}
                      handleCheckOut={handleCheckOut}
                      openNoteModal={openNoteModal}
                      openFeedbackModal={openFeedbackModal}
                      actionLoading={actionLoading}
                      userRole={userRole}
                      isCustomer={isCustomer}
                      isSkinTherapist={isSkinTherapist}
                      isStaffOrManager={isStaffOrManager}
                    />
                  </Card>
                </>
              )}
            </div>
          ) : (
            <div className="booking-details">
              {bookingSlots && bookingSlots.length > 0 ? (
                <>
                  <Title level={5}>
                    <ScheduleOutlined className="mr-2" />
                    Booking Slots
                  </Title>
                  <Card>
                    <BookingSlotTable
                      bookingSlots={bookingSlots}
                      expandedRowKeys={expandedRowKeys}
                      onExpandRow={onExpandRow}
                      slotDetails={slotDetails}
                      handleCheckIn={handleCheckIn}
                      handleCheckOut={handleCheckOut}
                      openNoteModal={openNoteModal}
                      openFeedbackModal={openFeedbackModal}
                      actionLoading={actionLoading}
                      userRole={userRole}
                      isCustomer={isCustomer}
                      isSkinTherapist={isSkinTherapist}
                      isStaffOrManager={isStaffOrManager}
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

      <TreatmentNoteModal
        visible={noteModalVisible}
        onCancel={() => setNoteModalVisible(false)}
        onSubmit={handleNoteSubmit}
        loading={actionLoading}
      />

      <FeedbackModal
        visible={feedbackModalVisible}
        onCancel={() => setFeedbackModalVisible(false)}
        onSubmit={handleFeedbackSubmit}
        loading={actionLoading}
      />
    </>
  );
};

export default BookingDetailModal;