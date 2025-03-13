import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Tag, Button, Space, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, PhoneOutlined, MailOutlined, ClockCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { getAllSkinTherapists } from '../../services/user.services';

const { Title, Text, Paragraph } = Typography;

const SkinTherapist = () => {
  const navigate = useNavigate();
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSchedule = (therapist) => {
    navigate('/schedule', { state: { therapist } });
  };

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const response = await getAllSkinTherapists();
        setTherapists(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch therapists:', error);
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="light-gray-background pb-20">
      <div
        className="banner-services bg-cover bg-center w-full h-[400px] relative"
        style={{
          backgroundImage:
            'url("https://oms.hotdeal.vn/images/editors/sources/000366451002/366451-366451-body-chung(8).jpg")',
        }}
      >
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-center bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <h2 className="text-3xl font-semibold text-blue-900">
            Our Skin Therapists
          </h2>
        </div>
      </div>

      <div className="mt-20" />

      <div className="container mx-auto px-6">
        {therapists.length === 0 ? (
          <div className="text-center text-gray-500 text-xl">
            No therapists found
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {therapists.map((therapist) => (
              <Col xs={24} md={12} key={therapist.id}>
                <Card bodyStyle={{ padding: 0 }}>
                  <Row>
                    <Col xs={24} sm={8} className="relative">
                      <div className="w-full h-full flex flex-col items-center justify-between p-4 ">
                        <div className='w-full h-[300px]'>
                          <img
                            src={therapist?.account?.accountImages ? therapist?.account?.accountImages[0] : therapist?.account?.imgLinks}
                            alt={therapist?.account?.fullName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex justify-center w-full">
                          <Button
                            type="primary"
                            size="large"
                            onClick={() => handleSchedule(therapist)}
                          >
                            Book Appointment
                          </Button>
                        </div>
                      </div>
                    </Col>

                    <Col xs={24} sm={16}>
                      <div className="p-6">
                        <Space direction="vertical" size={16} className="w-full">
                          <div>
                            <Title level={3} className="mb-2">
                              {therapist?.account?.fullName}
                            </Title>
                            <Space wrap>
                              {therapist.specialization.split(',').map((spec, index) => (
                                <Tag color="blue" key={index} className="mr-2">
                                  {spec.trim()}
                                </Tag>
                              ))}
                            </Space>
                          </div>

                          <Space direction="vertical" size={8}>
                            <Text type="secondary" className="flex items-center gap-2">
                              <ClockCircleOutlined /> Experience: {therapist.experience}
                            </Text>
                            <Text type="secondary" className="flex items-center gap-2">
                              <UserOutlined /> {therapist.account?.gender}, {therapist.account?.age} years old
                            </Text>

                            <Text type="secondary" className="flex items-center gap-2">
                              <MailOutlined /> {therapist?.account?.email}
                            </Text>

                          </Space>

                          <Paragraph className="text-gray-600">
                            {therapist.description}
                          </Paragraph>
                        </Space>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default SkinTherapist;