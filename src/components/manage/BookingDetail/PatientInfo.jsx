import React from "react";
import { Card, Row, Col, Typography, Divider } from "antd";
import { UserOutlined, PhoneOutlined } from "@ant-design/icons";
import { MdOutlineEmail } from "react-icons/md";
import { BsGenderAmbiguous } from "react-icons/bs";

const { Title } = Typography;

const PatientInfo = ({ patient }) => {
  if (!patient) return null;

  return (
    <>
      <Title level={5}>Patient Information</Title>
      <Card className="mb-4">
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div className="flex items-center">
              <UserOutlined className="mr-2" />
              <div>
                <div className="text-gray-500">Full Name</div>
                <div>{patient.fullName}</div>
              </div>
            </div>
          </Col>

          <Col span={12}>
            <div className="flex items-center">
              <MdOutlineEmail className="mr-2" />
              <div>
                <div className="text-gray-500">Email</div>
                <div>{patient.email}</div>
              </div>
            </div>
          </Col>

          <Col span={12}>
            <div className="flex items-center">
              <PhoneOutlined className="mr-2" />
              <div>
                <div className="text-gray-500">Phone</div>
                <div>{patient.phone}</div>
              </div>
            </div>
          </Col>

          <Col span={12}>
            <div className="flex items-center">
              <BsGenderAmbiguous className="mr-2" />
              <div>
                <div className="text-gray-500">Gender</div>
                <div>{patient.gender}</div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
      <Divider />
    </>
  );
};

export default PatientInfo;