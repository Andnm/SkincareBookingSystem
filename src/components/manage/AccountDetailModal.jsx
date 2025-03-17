import React, { useEffect, useState } from 'react';
import {
    Modal,
    Spin,
    Descriptions,
    Avatar,
    Typography,
    Divider,
    Image,
    Tag,
    Row,
    Col,
    Space
} from 'antd';
import { getAccountById } from '../../services/user.services';
import { toast } from 'react-toastify';
import { generateFallbackAvatar } from '../../utils/helpers';

const { Title, Text } = Typography;

const AccountDetailModal = ({ accountId, visible, onClose }) => {
    const [loading, setLoading] = useState(true);
    const [accountData, setAccountData] = useState(null);

    useEffect(() => {
        const fetchAccountDetails = async () => {
            if (accountId && visible) {
                setLoading(true);
                try {
                    const response = await getAccountById(accountId);
                    console.log("response account: ", response)
                    setAccountData(response);
                } catch (error) {
                    toast.error('Failed to load account details!');
                    console.error('Error fetching account details:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchAccountDetails();
    }, [accountId, visible]);

    const getStatusTag = (status) => {
        const statusColors = {
            active: 'green',
            inactive: 'red',
            pending: 'orange',
        };

        return (
            <Tag color={statusColors[status?.toLowerCase()] || 'blue'}>
                {status || 'Unknown'}
            </Tag>
        );
    };

    const renderAccountImages = (images) => {
        if (!images || images.length === 0) {
            return <Text italic>(No images available)</Text>;
        }

        return (
            <Row gutter={[8, 8]}>
                {images.map((imageUrl, index) => (
                    <Col key={index} span={6}>
                        <Image
                            src={imageUrl}
                            alt={`Account image ${index + 1}`}
                            style={{ width: '100%', height: 'auto', maxHeight: '150px', objectFit: 'cover' }}
                        />
                    </Col>
                ))}
            </Row>
        );
    };

    return (
        <Modal
            title={<Title level={4}>Account Details</Title>}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={700}
        >
            <Spin spinning={loading}>
                {accountData ? (
                    <>
                        <div className="flex items-center mb-4">
                            <Avatar
                                src={accountData.accountImages?.[0] || generateFallbackAvatar(accountData.fullName)}
                                alt={accountData.fullName}
                                size={80}
                                style={{ marginRight: '16px', border: '1px solid #d9d9d9' }}
                            />
                            <div>
                                <Title level={3} style={{ margin: 0 }}>
                                    {accountData.fullName}
                                </Title>
                                <Space>
                                    <Text type="secondary">{accountData.email}</Text>
                                    {getStatusTag(accountData.status)}
                                </Space>
                            </div>
                        </div>

                        <Divider />

                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="ID" span={2}>
                                {accountData.id}
                            </Descriptions.Item>
                            <Descriptions.Item label="Role">
                                {accountData.role}
                            </Descriptions.Item>
                            <Descriptions.Item label="Age">
                                {accountData.age || <Text italic>(Not provided)</Text>}
                            </Descriptions.Item>
                            <Descriptions.Item label="Gender">
                                {accountData.gender || <Text italic>(Not provided)</Text>}
                            </Descriptions.Item>
                            <Descriptions.Item label="Status">
                                {getStatusTag(accountData.status)}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="left">Account Images</Divider>
                        {renderAccountImages(accountData.accountImages)}
                    </>
                ) : !loading && (
                    <div className="text-center py-8">
                        <Text type="secondary">No account data available</Text>
                    </div>
                )}
            </Spin>
        </Modal>
    );
};

export default AccountDetailModal;