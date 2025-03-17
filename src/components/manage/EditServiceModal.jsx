import React, { useEffect, useState } from "react";
import {
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    Button,
    Spin,
    Typography,
} from "antd";
import { toast } from "react-toastify";
import { getServiceDetailById, updateService } from "../../services/service.services";

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const EditServiceModal = ({ serviceId, visible, onClose, onServiceUpdated }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [serviceData, setServiceData] = useState(null);

    const durationUnits = ["Minutes", "Hours", "Days"];
    const moneyUnits = ["VND", "USD", "EUR"];

    useEffect(() => {
        const fetchServiceDetails = async () => {
            if (serviceId && visible) {
                setLoading(true);
                try {
                    const response = await getServiceDetailById(serviceId);
                    setServiceData(response);

                    form.setFieldsValue({
                        name: response.name,
                        description: response.description,
                        price: response.price,
                        moneyUnit: response.moneyUnit,
                        duration: response.duration,
                        durationUnit: response.durationUnit,
                    });
                } catch (error) {
                    toast.error("Failed to fetch service details!");
                    toast.error(error?.response?.data?.message);
                    console.error("Error fetching service details:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchServiceDetails();
    }, [serviceId, visible, form]);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await updateService(serviceId, values);
            toast.success("Service updated successfully!");

            if (onServiceUpdated) {
                onServiceUpdated(response);
            }

            onClose();
        } catch (error) {
            toast.error("Failed to update service!");
            toast.error(error.response?.data?.message);
            console.error("Error updating service:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={<Title level={4}>Edit Service</Title>}
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={700}
            destroyOnClose={true}
        >
            <Spin spinning={loading}>
                {serviceData ? (
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{
                            moneyUnit: "VND",
                            durationUnit: "minutes",
                        }}
                    >
                        <Form.Item
                            name="name"
                            label="Service Name"
                            rules={[{ required: true, message: "Please enter service name" }]}
                        >
                            <Input placeholder="Enter service name" />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[{ required: true, message: "Please enter description" }]}
                        >
                            <TextArea rows={4} placeholder="Enter service description" />
                        </Form.Item>

                        <div className="flex gap-4">
                            <Form.Item
                                name="price"
                                label="Price"
                                rules={[{ required: true, message: "Please enter price" }]}
                                className="flex-1"
                            >
                                <InputNumber
                                    placeholder="Enter price"
                                    style={{ width: "100%" }}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>

                            <Form.Item
                                name="moneyUnit"
                                label="Currency"
                                rules={[{ required: true, message: "Please select currency" }]}
                            >
                                <Select style={{ width: 120 }}>
                                    {moneyUnits.map((unit) => (
                                        <Option key={unit} value={unit}>
                                            {unit}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>

                        <div className="flex gap-4">
                            <Form.Item
                                name="duration"
                                label="Duration"
                                rules={[{ required: true, message: "Please enter duration" }]}
                                className="flex-1"
                            >
                                <InputNumber
                                    placeholder="Enter duration"
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>

                            <Form.Item
                                name="durationUnit"
                                label="Duration Unit"
                                rules={[{ required: true, message: "Please select duration unit" }]}
                            >
                                <Select style={{ width: 120 }}>
                                    {durationUnits.map((unit) => (
                                        <Option key={unit} value={unit}>
                                            {unit}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>

                        {/* Vous pouvez ajouter d'autres champs selon votre modèle de données */}

                        <div className="flex justify-end mt-4">
                            <Button onClick={onClose} className="mr-2">
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Update Service
                            </Button>
                        </div>
                    </Form>
                ) : (
                    <div className="text-center py-4">Loading service data...</div>
                )}
            </Spin>
        </Modal>
    );
};

export default EditServiceModal;