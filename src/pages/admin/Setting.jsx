import React, { useState } from 'react';
import { Button, Card, List, message, Spin, Empty, Modal, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { getAllServiceType, getAllSkinIssue, getAllSkinType } from '../../services/service.services';
import { toast } from 'react-toastify';
import { getAllSlots } from '../../services/workingSchedule.services';

const Setting = () => {
    const [listData, setListData] = useState([]);
    const [activeButton, setActiveButton] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async (apiCall, buttonType) => {
        try {
            setLoading(true);
            setActiveButton(buttonType);
            setListData([]);

            const data = await Promise.all([
                apiCall(),
            ]).then(([apiData]) => apiData);

            console.log("data: ", data)

            setListData(data.data);
        } catch (error) {
            toast.error(`Failed to fetch ${buttonType} data`);
            console.error(error);
            setListData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        Modal.confirm({
            title: 'Edit Item',
            content: `Are you sure you want to edit ${item.name}?`,
            onOk() {
                console.log('Edit', item);
                toast.info(`Editing ${item.name}`);
            },
        });
    };

    const handleDelete = (item) => {
        Modal.confirm({
            title: 'Delete Item',
            content: `Are you sure you want to delete ${item.name}?`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                console.log('Delete', item);
                toast.warning(`Deleted ${item.name}`);
            },
        });
    };

    const handleSkinIssueClick = () => fetchData(getAllSkinIssue, 'Skin Issues');
    const handleSkinTypeClick = () => fetchData(getAllSkinType, 'Skin Type');
    const handleServiceTypeClick = () => fetchData(getAllServiceType, 'Service Type');
    const handleSlotsClick = () => fetchData(getAllSlots, 'Slots');

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-[300px]">
                    <div className="text-center">
                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 mx-auto animate-spin"></div>
                        <p className="text-gray-600">Loading data...</p>
                    </div>
                </div>
            );
        }

        if (listData.length === 0 && !loading) {
            return (
                <Empty
                    description="No data available. Click a button to load."
                    style={{ margin: '50px 0' }}
                />
            );
        }

        if (activeButton === 'Slots') {
            return (
                <List
                    dataSource={listData}
                    renderItem={(item, index) => (
                        <List.Item
                            key={item.id}
                            actions={[
                                <EditOutlined
                                    key="edit"
                                    onClick={() => handleEdit(item)}
                                    style={{
                                        fontSize: '18px',
                                        color: '#1890ff',
                                        cursor: 'pointer',
                                        marginRight: '10px'
                                    }}
                                />,
                                <DeleteOutlined
                                    key="delete"
                                    onClick={() => handleDelete(item)}
                                    style={{
                                        fontSize: '18px',
                                        color: '#ff4d4f',
                                        cursor: 'pointer'
                                    }}
                                />
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<ClockCircleOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
                                title={`Slot ${item.slotNumber}`}
                                description={`${item.startTime} - ${item.endTime}`}
                            />
                            <div>
                                <Tag
                                    color={item.status === 'Available' ? 'green' : 'red'}
                                    icon={item.status === 'Available' ? <CheckCircleOutlined /> : null}
                                >
                                    {item.status}
                                </Tag>
                            </div>
                        </List.Item>
                    )}
                    pagination={{
                        pageSize: 5,
                        showSizeChanger: true,
                        showQuickJumper: true,
                    }}
                />
            );
        }

        return (
            <List
                dataSource={listData}
                renderItem={(item, index) => (
                    <List.Item
                        key={index}
                        actions={[
                            <EditOutlined
                                key="edit"
                                onClick={() => handleEdit(item)}
                                style={{
                                    fontSize: '18px',
                                    color: '#1890ff',
                                    cursor: 'pointer',
                                    marginRight: '10px'
                                }}
                            />,
                            <DeleteOutlined
                                key="delete"
                                onClick={() => handleDelete(item)}
                                style={{
                                    fontSize: '18px',
                                    color: '#ff4d4f',
                                    cursor: 'pointer'
                                }}
                            />
                        ]}
                    >
                        <List.Item.Meta
                            title={item?.name}
                        />
                    </List.Item>
                )}
                pagination={{
                    pageSize: 5,
                    showSizeChanger: true,
                    showQuickJumper: true,
                }}
            />
        );
    };

    const buttonConfigs = [
        {
            key: 'Skin Issues',
            onClick: handleSkinIssueClick,
        },
        {
            key: 'Skin Type',
            onClick: handleSkinTypeClick,
        },
        {
            key: 'Service Type',
            onClick: handleServiceTypeClick,
        },
        {
            key: 'Slots',
            onClick: handleSlotsClick,
        }
    ];

    return (
        <div className="max-w-xl mx-auto px-4 py-6">

            <div className="flex justify-center space-x-4 mb-6">
                {buttonConfigs.map(({ key, onClick }) => (
                    <Button
                        key={key}
                        type={activeButton === key ? 'primary' : 'default'}
                        onClick={onClick}
                        loading={loading && activeButton === key}
                    >
                        {key}
                    </Button>
                ))}
            </div>

            <Card
                title={activeButton ? `${activeButton} List` : 'Select a Category'}
                bordered={true}
                className="shadow-md"
            >
                {renderContent()}
            </Card>
        </div>
    );
};

export default Setting;