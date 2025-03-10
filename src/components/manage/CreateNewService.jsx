import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Select, Form, InputNumber, Upload, Spin, message } from "antd";
import { PlusOutlined, UploadOutlined, InboxOutlined } from "@ant-design/icons";
import { createNewService, getAllSkinIssue, getAllSkinType, getAllServiceType } from "../../services/service.services";
import { toast } from "react-toastify";

const { Option } = Select;
const { TextArea } = Input;

const CreateNewService = ({ onServiceCreated }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [skinIssues, setSkinIssues] = useState([]);
    const [skinTypes, setSkinTypes] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);

    useEffect(() => {
        if (isModalVisible) {
            fetchOptions();
        }
    }, [isModalVisible]);

    const fetchOptions = async () => {
        setLoading(true);
        try {
            const [skinIssuesRes, skinTypesRes, serviceTypesRes] = await Promise.all([
                getAllSkinIssue(),
                getAllSkinType(),
                getAllServiceType()
            ]);

            setSkinIssues(skinIssuesRes.data || []);
            setSkinTypes(skinTypesRes.data || []);
            setServiceTypes(serviceTypesRes.data || []);
        } catch (error) {
            toast.error("Failed to load form options!");
            console.error("Error loading options:", error);
        } finally {
            setLoading(false);
        }
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        form.resetFields();
        setUploadedImages([]);
        setIsModalVisible(false);
    };

    const customUploadRequest = async ({ file, onSuccess, onError }) => {
        const cloud_name = process.env.REACT_APP_CLOUD_NAME;
        const uploadPreset = process.env.REACT_APP_UPLOAD_PRESET;

        if (!cloud_name || !uploadPreset) {
            onError(new Error("Cloudinary configuration is missing"));
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const data = await response.json();
            onSuccess(data, file);

            setUploadedImages(prev => [...prev, data.secure_url]);
        } catch (error) {
            onError(error);
            toast.error("Image upload failed");
        }
    };

    const handleCreateService = (values) => {
        Modal.confirm({
            title: "Confirm Service Creation",
            content: "Are you sure you want to create this service?",
            okText: "Yes",
            cancelText: "No",
            onOk: async () => {
                try {
                    setLoading(true);

                    // Prepare the data for API
                    const serviceData = {
                        ...values,
                        Images: uploadedImages,
                        ServiceSkinIssues: values.ServiceSkinIssues?.map(id => ({ id })),
                        ServiceSkinTypes: values.ServiceSkinTypes?.map(id => ({ id })),
                        ServiceTypes: values.ServiceTypes?.map(id => ({ id }))
                    };

                    console.log("Service Data:", serviceData);
                    await createNewService(serviceData);

                    toast.success("Service created successfully!");

                    if (onServiceCreated) {
                        onServiceCreated();
                    }

                    handleCancel();
                } catch (error) {
                    toast.error("Service creation failed! Please try again.");
                    console.error("Error creating service:", error);
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        <div>
            <Button onClick={showModal} icon={<PlusOutlined />} type="primary">
                Create New Service
            </Button>

            <Modal
                title="Create New Service"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={1000}
                style={{ top: 10 }}
            >
                <Spin spinning={loading}>
                    <Form
                        form={form}
                        onFinish={handleCreateService}
                        layout="vertical"
                        initialValues={{
                            DurationUnit: "Minutes",
                            MoneyUnit: "VND"
                        }}
                    >
                        <Form.Item
                            label="Service Name"
                            name="Name"
                            rules={[{ required: true, message: "Please input service name!" }]}
                        >
                            <Input placeholder="Enter service name" />
                        </Form.Item>

                        <Form.Item
                            label="Description"
                            name="Description"
                            rules={[{ required: true, message: "Please input description!" }]}
                        >
                            <TextArea rows={4} placeholder="Enter description" />
                        </Form.Item>

                        <div className="flex gap-4">
                            <Form.Item
                                label="Duration"
                                name="Duration"
                                className="w-1/2"
                                rules={[{ required: true, message: "Please input duration!" }]}
                            >
                                <InputNumber min={1} placeholder="Duration" className="w-full" />
                            </Form.Item>

                            <Form.Item
                                label="Duration Unit"
                                name="DurationUnit"
                                className="w-1/2"
                                rules={[{ required: true, message: "Please select duration unit!" }]}
                            >
                                <Select placeholder="Select duration unit">
                                    <Option value="Minutes">Minutes</Option>
                                    <Option value="Hours">Hours</Option>
                                </Select>
                            </Form.Item>
                        </div>

                        <div className="flex gap-4">
                            <Form.Item
                                label="Price"
                                name="Price"
                                className="w-1/2"
                                rules={[{ required: true, message: "Please input price!" }]}
                            >
                                <InputNumber
                                    min={0}
                                    placeholder="Enter price"
                                    className="w-full"
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Currency"
                                name="MoneyUnit"
                                className="w-1/2"
                                rules={[{ required: true, message: "Please select currency!" }]}
                            >
                                <Select placeholder="Select currency">
                                    <Option value="VND">VND</Option>
                                    <Option value="USD">USD</Option>
                                </Select>
                            </Form.Item>
                        </div>

                        <Form.Item
                            label="Upload Images"
                            name="Images"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            rules={[{ required: true, message: "Please upload at least one image!" }]}
                        >
                            <Upload
                                listType="picture-card"
                                customRequest={customUploadRequest}
                                onChange={({ fileList }) => console.log("fileList changed", fileList)}
                                multiple={true}
                            >
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            </Upload>
                        </Form.Item>

                        <Form.Item
                            label="Service Types"
                            name="ServiceTypes"
                            rules={[{ required: true, message: "Please select at least one service type!" }]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Select service types"
                                showSearch
                                optionFilterProp="children"
                            >
                                {serviceTypes.map(type => (
                                    <Option key={type.id} value={type.id}>{type.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Skin Types"
                            name="ServiceSkinTypes"
                            rules={[{ required: true, message: "Please select at least one skin type!" }]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Select skin types"
                                showSearch
                                optionFilterProp="children"
                            >
                                {skinTypes.map(type => (
                                    <Option key={type.id} value={type.id}>{type.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Skin Issues"
                            name="ServiceSkinIssues"
                            rules={[{ required: true, message: "Please select at least one skin issue!" }]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Select skin issues"
                                showSearch
                                optionFilterProp="children"
                            >
                                {skinIssues.map(issue => (
                                    <Option key={issue.id} value={issue.id}>{issue.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <div className="flex justify-end">
                                <Button type="default" onClick={handleCancel} className="mr-2">
                                    Cancel
                                </Button>
                                <Button type="primary" htmlType="submit">
                                    Create Service
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
        </div>
    );
};

export default CreateNewService;