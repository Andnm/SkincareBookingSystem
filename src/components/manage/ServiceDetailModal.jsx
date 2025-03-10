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
    Image,
    Empty
} from "antd";
import { toast } from "react-toastify";
import {
    TagOutlined,
    SkinOutlined,
    BulbOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    FileTextOutlined,
    PictureOutlined
} from "@ant-design/icons";
import { getServiceDetailById } from "../../services/service.services";

const { Title, Text, Paragraph } = Typography;

const ServiceDetailModal = ({ serviceId, visible, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [serviceDetails, setServiceDetails] = useState(null);

    useEffect(() => {
        const fetchServiceDetails = async () => {
            if (serviceId && visible) {
                setIsLoading(true);
                try {
                    const response = await getServiceDetailById(serviceId);
                    console.log("response: ", response)
                    setServiceDetails(response);
                } catch (error) {
                    toast.error("Failed to load service details!");
                    toast.error(error.response?.data?.message);
                    console.error("Error loading service details:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchServiceDetails();
    }, []);

    const renderTags = (items) => {
        if (!items || items.length === 0) return <span>None</span>;

        return (
            <div className="flex flex-wrap gap-1">
                {items.map(item => (
                    <Tag key={item.id} color="blue">{item.name}</Tag>
                ))}
            </div>
        );
    };

    return (
        <Modal
            title={<Title level={4}>Service Details</Title>}
            open={visible}
            onCancel={onClose}
            footer={[]}
            width={1000}
            style={{ top: 10 }}
        >
            <Spin spinning={isLoading}>
                {serviceDetails ? (
                    <div className="service-details">
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="Service ID" span={2}>
                                {serviceDetails.id}
                            </Descriptions.Item>

                            <Descriptions.Item label="Name" span={2}>
                                <Text strong>{serviceDetails.name}</Text>
                            </Descriptions.Item>

                            <Descriptions.Item label="Duration">
                                <ClockCircleOutlined className="mr-1" />
                                {serviceDetails.duration} {serviceDetails.durationUnit}
                            </Descriptions.Item>

                            <Descriptions.Item label="Price">
                                <DollarOutlined className="mr-1" />
                                <Text strong>
                                    {serviceDetails.price?.toLocaleString()} {serviceDetails.moneyUnit}
                                </Text>
                            </Descriptions.Item>
                        </Descriptions>

                        {serviceDetails.description && (
                            <>
                                <Divider />
                                <Title level={5}>
                                    <FileTextOutlined className="mr-2" /> Description
                                </Title>
                                <Card className="mb-4">
                                    <Paragraph>{serviceDetails.description}</Paragraph>
                                </Card>
                            </>
                        )}

                        {serviceDetails.imageURLs && serviceDetails.imageURLs.length > 0 && (
                            <>
                                <Divider />
                                <Title level={5}>
                                    <PictureOutlined className="mr-2" /> Service Images
                                </Title>
                                <div className="mb-4">
                                    <Row gutter={[16, 16]}>
                                        {serviceDetails.imageURLs.map((url, index) => (
                                            <Col xs={24} sm={12} md={8} key={index}>
                                                <Image
                                                    src={url}
                                                    alt={`Service image ${index + 1}`}
                                                    style={{ width: '300px', height: '200px', objectFit: 'cover' }}
                                                />
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            </>
                        )}

                        <Divider />
                        <Row gutter={[24, 24]}>
                            <Col span={24}>
                                <Title level={5}>
                                    <TagOutlined className="mr-2" /> Service Types
                                </Title>
                                <Card className="mb-4">
                                    {renderTags(serviceDetails.types)}
                                </Card>
                            </Col>

                            <Col span={12}>
                                <Title level={5}>
                                    <SkinOutlined className="mr-2" /> Suitable Skin Types
                                </Title>
                                <Card className="mb-4">
                                    {renderTags(serviceDetails.skinTypes)}
                                </Card>
                            </Col>

                            <Col span={12}>
                                <Title level={5}>
                                    <BulbOutlined className="mr-2" /> Addresses Skin Issues
                                </Title>
                                <Card className="mb-4">
                                    {renderTags(serviceDetails.skinIssues)}
                                </Card>
                            </Col>
                        </Row>
                    </div>
                ) : !isLoading && (
                    <div className="text-center py-8">
                        <Empty description="No service details available" />
                    </div>
                )}
            </Spin>
        </Modal>
    );
};

export default ServiceDetailModal;