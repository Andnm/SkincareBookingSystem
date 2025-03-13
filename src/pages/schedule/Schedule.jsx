import React, { useState, useEffect, useRef } from 'react';
import { Form, Select, DatePicker, Radio, Input, Button, Typography, Space, Checkbox, Row, Col, Card, Switch } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useScrollToTop } from '../../utils/helpers';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { getAllSlots } from '../../services/workingSchedule.services';
import { toast } from 'react-toastify';
import { getAllServices } from '../../services/service.services';
import { getAllSkinTherapists } from '../../services/user.services';
import { useSelector } from 'react-redux';
import { userSelector } from '../../redux/selectors/selector';
import { createBookings, getAllSkinTherapistByWorkingDateAndSlotId } from '../../services/booking.services';

dayjs.extend(customParseFormat);

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;


const Schedule = () => {
  useScrollToTop();
  const [form] = Form.useForm();
  const detailsSectionRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const selectedService = location.state?.service;
  const userData = useSelector(userSelector);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookForSelf, setBookForSelf] = useState(true);
  const [therapists, setTherapists] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState({
    slots: false,
    services: false,
    therapists: false
  });


  useEffect(() => {
    fetchTimeSlots();
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedService) {
      form.setFieldsValue({
        services: selectedService.id
      });
    }

    if (userData && bookForSelf) {
      form.setFieldsValue({
        fullName: userData?.user?.fullName,
        email: userData?.user?.email,
      });
    }

    if (selectedService) {
      if (detailsSectionRef.current) {
        detailsSectionRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  }, [selectedService, services, form, userData]);

  // Thêm useEffect để fetch therapists dựa trên ngày và slot đã chọn
  useEffect(() => {
    if (selectedDate && selectedSlot) {
      fetchTherapistsByDateAndSlot();
    }
  }, [selectedDate, selectedSlot]);

  const handleBookForSelfChange = (checked) => {
    setBookForSelf(checked);

    if (checked && userData) {
      form.setFieldsValue({
        fullName: userData?.user?.fullName,
        email: userData?.user?.email,
      });
    } else {
      form.setFieldsValue({
        fullName: undefined,
        email: undefined,
      });
    }
  };

  const fetchTimeSlots = async () => {
    try {
      setLoading(prev => ({ ...prev, slots: true }));
      const response = await getAllSlots();
      setTimeSlots(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch time slots');
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, slots: false }));
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(prev => ({ ...prev, services: true }));
      const response = await getAllServices();
      setServices(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch services');
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, services: false }));
    }
  };

  const fetchTherapistsByDateAndSlot = async () => {
    try {
      setLoading(prev => ({ ...prev, therapists: true }));

      form.setFieldsValue({ therapist: undefined });

      const params = {
        workingDate: selectedDate.format('YYYY-MM-DD'),
        slotId: selectedSlot
      };

      const response = await getAllSkinTherapistByWorkingDateAndSlotId(params);
      setTherapists(response || []);

      if (response && response.length === 0) {
        toast.info('No therapists available for the selected date and time slot');
      }
    } catch (error) {
      console.error('Failed to fetch therapists:', error);
      toast.error('Failed to fetch available therapists');
      setTherapists([]);
    } finally {
      setLoading(prev => ({ ...prev, therapists: false }));
    }
  };

  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
  };

  const isSlotDisabled = (slot) => {
    if (!selectedDate) return false;

    const now = dayjs();
    const selectedMoment = dayjs(selectedDate);

    if (selectedMoment.isSame(now, 'day')) {
      const currentHour = now.hour();
      const currentMinute = now.minute();

      const [slotHour, slotMinute] = slot.startTime.split(':').map(Number);

      if (currentHour > slotHour || (currentHour === slotHour && currentMinute > slotMinute)) {
        return true;
      }

      const slotStartTime = dayjs(selectedDate)
        .hour(slotHour)
        .minute(slotMinute);

      const minutesDiff = slotStartTime.diff(now, 'minute');
      if (minutesDiff < 30) {
        return true;
      }
    }

    return false;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    form.setFieldsValue({ timeSlot: undefined, therapist: undefined });
    setSelectedSlot(null);
    setTherapists([]);
  };

  const handleTimeSlotChange = (slotId) => {
    setSelectedSlot(slotId);
  };

  const handleCreateBooking = async (values) => {
    if (!userData) {
      toast.error('Please login before booking');
      return;
    }

    try {
      const bookingData = {
        serviceId: values.services,
        ...(bookForSelf ? {} : {
          patient: {
            fullName: values.fullName,
            gender: values.gender,
            phone: values.phone,
            email: values.email,
          }
        }),
        bookingDate: values.date.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        type: 'ONLINE',
        bookForCustomerAccountOwner: bookForSelf,
        bookingSlotCreateDTO: {
          slotId: values.timeSlot,
          skinTherapistId: values.therapist
        }
      };

      const response = await createBookings(bookingData);

      console.log("response bookings: ", response)

      toast.success('Booking successful!');
      navigate('/account-history');

    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div className="bg-gray-50 pb-20">
      <div
        className="banner-services bg-cover bg-center w-full h-[400px] relative"
        style={{
          backgroundImage:
            'url("https://www.vinmec.com/static/uploads/cover_list_doctor_f60bffe168.jpg")',
        }}
      >
        <div
          ref={detailsSectionRef}
          className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-center bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <h2 className="text-3xl font-semibold text-blue-900">
            Appointment Booking
          </h2>
        </div>
      </div>

      <div className="mt-20" />

      <div className="container mx-auto px-6">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateBooking}
        >
          <Card className="mb-8">
            <Title level={4} className="mb-6" style={{
              borderLeft: '4px solid #1890ff',
              paddingLeft: '12px'
            }}>
              Details of appointment booking
            </Title>

            <Row gutter={24} className='mt-4'>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Select Services"
                  name="services"
                  rules={[{ required: true, message: 'Please select a service' }]}
                >
                  <Select
                    loading={loading.services}
                    placeholder="Select a service"
                  >
                    {services.map((service, index) => (
                      <Option key={index} value={service.id}>
                        {service.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Appointment Date"
                  name="date"
                  rules={[{ required: true, message: 'Please select a date' }]}
                >
                  <DatePicker
                    className="w-full"
                    disabledDate={disabledDate}
                    onChange={handleDateChange}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Available Time Slots"
                  name="timeSlot"
                  rules={[{ required: true, message: 'Please select a time slot' }]}
                >
                  <Radio.Group
                    className="w-full"
                    loading={loading.slots ? 'true' : 'false'}
                    onChange={(e) => handleTimeSlotChange(e.target.value)}
                  >
                    <Space wrap>
                      {timeSlots.map((slot) => (
                        <Radio.Button
                          key={slot.id}
                          value={slot.id}
                          className="mb-2"
                          disabled={isSlotDisabled(slot)}
                        >
                          {`Slot ${slot.slotNumber} (${slot.startTime} - ${slot.endTime})`}
                        </Radio.Button>
                      ))}
                    </Space>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  label="Select Skin Therapist"
                  name="therapist"
                  rules={[{ required: true, message: 'Please select a therapist' }]}
                >
                  <Select
                    loading={loading.therapists}
                    placeholder={selectedDate && selectedSlot ? "Select a skin therapist" : "Please select date and time slot first"}
                    disabled={!selectedDate || !selectedSlot}
                  >
                    {therapists.map(therapist => (
                      <Option key={therapist?.account?.id} value={therapist?.account?.id}>
                        {therapist?.account?.fullName} - {therapist?.specialization.split(',')[0]}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card style={{ marginTop: "40px" }}>
            <Title level={4} className="mb-6" style={{
              borderLeft: '4px solid #1890ff',
              paddingLeft: '12px'
            }}>
              Customer information
            </Title>

            <div className="mb-4 mt-4 flex items-center">
              <Text className="mr-2">Book for myself</Text>
              <Switch
                checked={bookForSelf}
                onChange={handleBookForSelfChange}
              />
            </div>
            {!bookForSelf &&
              (
                <>
                  <Row gutter={24} className='mt-4'>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Full Name"
                        name="fullName"
                        rules={[{ required: true, message: 'Please enter your name' }]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label="Gender"
                        name="gender"
                        rules={[{ required: true, message: 'Please select your gender' }]}
                      >
                        <Radio.Group>
                          <Radio value="male">Male</Radio>
                          <Radio value="female">Female</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Phone Number"
                        name="phone"
                        rules={[{ required: true, message: 'Please enter your phone number' }]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label="Email"
                        name="email"
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item
                        label="Reason for Visit"
                        name="reason"
                        rules={[{ required: true, message: 'Please enter your reason for visit' }]}
                      >
                        <TextArea rows={4} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="agreement"
                    valuePropName="checked"
                    rules={[{ required: true, message: 'Please accept the terms' }]}
                  >
                    <Checkbox>
                      I have read and agree to the privacy policy
                    </Checkbox>
                  </Form.Item>
                </>
              )
            }

            <Form.Item className="text-center">
              <Button type="primary" htmlType="submit" size="large">
                Book Appointment
              </Button>
            </Form.Item>
          </Card>
        </Form>
      </div>
    </div>
  );
};

export default Schedule;