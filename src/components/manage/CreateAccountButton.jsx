import React, { useState } from "react";
import { Modal, Button, Input, Select, Form, message, Upload } from "antd";
import { ROLE_SKINTHERAPIST, ROLE_STAFF } from "../../utils/constants";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { createAccountByManager } from "../../services/user.services";
import { toast } from "react-toastify";
import axios from "axios";

const { Option } = Select;

const CreateAccount = ({ onAccountCreated }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [imageFiles, setImageFiles] = useState([]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.REACT_APP_UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`, 
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      toast.error('Image upload failed');
      return null;
    }
  };

  const handleFileChange = (info) => {
    const fileList = [...info.fileList];
    setImageFiles(fileList);
  };


  const handleCreateAccount = async (values) => {
    Modal.confirm({
      title: "Confirm Account Creation",
      content: "Are you sure you want to create this account?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          const formData = new FormData();

          Object.keys(values).forEach(key => {
            formData.append(key, values[key]);
          });

          imageFiles.forEach((file) => {
            formData.append('images', file.originFileObj);
          });

          console.log("Account Info: ", Object.fromEntries(formData));
          
          await createAccountByManager(formData);

          toast.success("Account created successfully!");
          
          if (onAccountCreated) {
            onAccountCreated(values);
          }

          setIsModalVisible(false);
          form.resetFields();
          setImageFiles([]); // Reset danh sách ảnh
        } catch (error) {
          toast.error("Account creation failed! Please try again.");
          console.error("Error creating account:", error);
        }
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
        open={isModalVisible}
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

          <Form.Item
            label="Profile Images"
            name="profileImages"
          >
            <Upload 
              fileList={imageFiles}
              onChange={handleFileChange}
              beforeUpload={() => false} 
              listType="picture"
              multiple
            >
              <Button icon={<UploadOutlined />}>Select Images</Button>
            </Upload>
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
