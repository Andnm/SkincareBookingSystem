import React, { useState, useEffect } from 'react';
import { Form, Select, DatePicker, Radio, Input, Button, Typography, Space, Checkbox, Row, Col, Card } from 'antd';
import { useLocation } from 'react-router-dom';
import { list_services_data_sample, therapistData } from '../../utils/constants';
import { useScrollToTop } from '../../utils/helpers';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;


const Schedule = () => {
  useScrollToTop();
  const [form] = Form.useForm();
  const [selectedDate, setSelectedDate] = useState(null);
  const location = useLocation();
  const selectedTherapist = location.state?.therapist;

  const timeSlots = [
    {
      value: "slot1",
      label: "8:00 - 10:00",
      startTime: "08:00",
      endTime: "10:00"
    },
    {
      value: "slot2",
      label: "10:30 - 12:30",
      startTime: "10:30",
      endTime: "12:30"
    },
    {
      value: "slot3",
      label: "13:00 - 15:00",
      startTime: "13:00",
      endTime: "15:00"
    },
    {
      value: "slot4",
      label: "15:30 - 17:30",
      startTime: "15:30",
      endTime: "17:30"
    },
    {
      value: "slot5",
      label: "18:00 - 20:00",
      startTime: "18:00",
      endTime: "20:00"
    }
  ];

  useEffect(() => {
    if (selectedTherapist) {
      form.setFieldsValue({
        therapist: selectedTherapist.id
      });
    }
  }, [selectedTherapist, form]);

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
    form.setFieldsValue({ timeSlot: undefined });
  };

  const onFinish = (values) => {
    const formattedValues = {
      ...values,
      date: values.date?.format('YYYY-MM-DD')
    };
    console.log('Form values:', formattedValues);
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
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-center bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
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
          onFinish={onFinish}
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
                  label="Select Therapist"
                  name="therapist"
                  rules={[{ required: true, message: 'Please select a therapist' }]}
                >
                  <Select>
                    {therapistData.map(therapist => (
                      <Option key={therapist.id} value={therapist.id}>
                        {therapist.fullName} - {therapist.specialization.split(',')[0]}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Select Services"
                  name="services"
                  rules={[{ required: true, message: 'Please select a service' }]}
                >
                  <Select>
                    {list_services_data_sample.map((service, index) => (
                      <Option key={index} value={service.id}>
                        {service.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
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

                <Form.Item
                  label="Available Time Slots"
                  name="timeSlot"
                  rules={[{ required: true, message: 'Please select a time slot' }]}
                >
                  <Radio.Group className="w-full">
                    <Card className="w-full" size="small">
                      <Space wrap>
                        {timeSlots.map((slot) => (
                          <Radio.Button
                            key={slot.value}
                            value={slot.value}
                            className="mb-2"
                            disabled={isSlotDisabled(slot)}
                          >
                            {slot.label}
                          </Radio.Button>
                        ))}
                      </Space>
                    </Card>
                  </Radio.Group>
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