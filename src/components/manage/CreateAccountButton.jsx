import React, { useState } from "react";
import { Modal, Button, Input, Select, Form, message } from "antd";
import { ROLE_SKINTHERAPIST, ROLE_STAFF } from "../../utils/constants";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const CreateAccount = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCreateAccount = (values) => {
    Modal.confirm({
      title: "Confirm Account Creation",
      content: "Are you sure you want to create this account?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        console.log("Account Info: ", values);

        message.success("Account created successfully!");
        setIsModalVisible(false);
        form.resetFields();
      },
    });
  };

  return (
    <div>
      <Button onClick={showModal} icon={<PlusOutlined />}>
        Create New Account
      </Button>

      <Modal
        title="Create Account"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleCreateAccount}
          layout="horizontal"
          labelCol={{ span: 5 }}
        >
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select a role!" }]}
          >
            <Select placeholder="Select a role">
              <Option value={ROLE_SKINTHERAPIST}>Skin Therapist</Option>
              <Option value={ROLE_STAFF}>Staff</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[
              { required: true, message: "Please input your full name!" },
            ]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            label="Age"
            name="age"
            rules={[{ required: true, message: "Please input your age!" }]}
          >
            <Input type="number" placeholder="Enter age" />
          </Form.Item>

          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Please select your gender!" }]}
          >
            <Select placeholder="Select gender">
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end">
              <Button type="primary" htmlType="submit">
                Create
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateAccount;
