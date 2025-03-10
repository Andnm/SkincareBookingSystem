import React, { useState, useEffect } from 'react';
import { Calendar, Card, Typography, Button, Tag, Modal, Table, Spin, Space, Input, Form, Tooltip, Select, DatePicker } from 'antd';
import { LeftOutlined, RightOutlined, CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import {
    getAllSlots,
    getAllWorkingSchedule,
    getWorkingScheduleDetailById,
    registerWorkingSchedule,
} from '../../services/workingSchedule.services';
import { toast } from 'react-toastify';
import AccountLayout from '../../components/layout/AccountLayout';
import { SLOT_COLORS } from '../../utils/constants';

dayjs.locale('vi');

const WorkingSchedule = () => {
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [scheduleData, setScheduleData] = useState({});
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSlotInfo, setSelectedSlotInfo] = useState({
        slotNumber: null,
        date: null,
        title: ''
    });
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [scheduleDetails, setScheduleDetails] = useState([]);

    const [slots, setSlots] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [selectedDates, setSelectedDates] = useState([]);
    const [signUpModalVisible, setSignUpModalVisible] = useState(false);

    useEffect(() => {
        fetchSlots();
        fetchWorkingSchedules();
    }, []);

    const fetchSlots = async () => {
        try {
            const response = await getAllSlots();
            setSlots(response?.data);
        } catch (error) {
            toast.error('Failed to fetch slots');
            console.error(error);
        }
    };

    const handleSignUpSchedule = () => {
        setSignUpModalVisible(true);
    };

    const handleRegisterWorkingSchedule = async () => {
        if (selectedSlots.length === 0 || selectedDates.length === 0) {
            toast.error('Please select at least one slot and one date');
            return;
        }

        const registrationData = selectedDates.flatMap(date =>
            selectedSlots.map(slotId => ({
                slotId: slotId,
                workingDate: date.toISOString()
            }))
        );

        Modal.confirm({
            title: 'Confirm Registration',
            content: `Are you sure you want to register for ${registrationData.length} working schedules?`,
            onOk: async () => {
                try {
                    await registerWorkingSchedule(registrationData);
                    toast.success('Working schedules registered successfully');

                    setSignUpModalVisible(false);
                    setSelectedSlots([]);
                    setSelectedDates([]);

                    fetchWorkingSchedules();
                } catch (error) {
                    toast.error('Failed to register working schedules');
                    console.error(error);
                }
            }
        });
    };


    const fetchWorkingSchedules = async () => {
        try {
            setLoading(true);
            const response = await getAllWorkingSchedule();

            const formattedSchedules = response?.data?.reduce((acc, schedule) => {
                const [day, month, year] = schedule.workingDate.split('/');
                const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

                if (!acc[formattedDate]) {
                    acc[formattedDate] = {};
                }

                if (!acc[formattedDate][schedule.slotNumber]) {
                    acc[formattedDate][schedule.slotNumber] = [];
                }

                acc[formattedDate][schedule.slotNumber].push(schedule);

                return acc;
            }, {});

            setScheduleData(formattedSchedules);
        } catch (error) {
            toast.error('Failed to fetch working schedules');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchScheduleDetails = async (slotItems) => {
        setDetailsLoading(true);
        try {
            const detailPromises = slotItems.map(item => getWorkingScheduleDetailById(item.id));
            const detailsResponse = await Promise.all(detailPromises);
            setScheduleDetails(detailsResponse);
        } catch (error) {
            toast.error('Failed to fetch schedule details');
            console.error(error);
        } finally {
            setDetailsLoading(false);
        }
    };

    const showSlotDetails = (date, slotNumber, slotItems) => {
        setSelectedSlotInfo({
            slotNumber,
            date,
            title: `Slot ${slotNumber} - ${dayjs(date).format('DD/MM/YYYY')}`
        });
        setModalVisible(true);
        fetchScheduleDetails(slotItems);
    };

    const dateCellRender = (value) => {
        const dateString = value.format('YYYY-MM-DD');
        const dateSchedules = scheduleData[dateString];

        if (dateSchedules) {
            const slotNumbers = Object.keys(dateSchedules);

            if (slotNumbers.length === 0) return null;

            return (
                <div className="flex flex-wrap gap-1">
                    {slotNumbers.map((slotNumber, index) => {
                        const slots = dateSchedules[slotNumber];
                        const colorIndex = (parseInt(slotNumber) - 1) % SLOT_COLORS.length;
                        const timeRange = slots.length > 0 ?
                            `${slots[0].startTime} - ${slots[0].endTime}` : '';

                        return (
                            <Tag
                                key={slotNumber}
                                color={SLOT_COLORS[colorIndex]}
                                className="cursor-pointer mb-1"
                                onClick={() => showSlotDetails(dateString, slotNumber, slots)}
                            >
                                Slot {slotNumber} {timeRange && `(${timeRange})`}
                            </Tag>
                        );
                    })}
                </div>
            );
        }
        return null;
    };

    const monthCellRender = (value) => {
        const month = value.month();
        const year = value.year();

        let totalSchedules = 0;
        Object.keys(scheduleData).forEach(dateStr => {
            const scheduleDate = dayjs(dateStr);
            if (scheduleDate.year() === year && scheduleDate.month() === month) {
                Object.values(scheduleData[dateStr]).forEach(slots => {
                    totalSchedules += slots.length;
                });
            }
        });

        return totalSchedules > 0 ? (
            <div className="notes-month">
                <Typography.Text type="secondary">
                    {totalSchedules} tasks
                </Typography.Text>
            </div>
        ) : null;
    };

    const handlePanelChange = (date) => {
        setCurrentDate(date);
    };

    const handleMonthChange = (offset) => {
        const newDate = currentDate.clone().add(offset, 'month');
        setCurrentDate(newDate);
    };

    const getEnglishMonthName = (date) => {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return monthNames[date.month()];
    };

    const detailColumns = [
        {
            title: 'Time',
            key: 'time',
            render: (_, record) => `${record.startTime} - ${record.endTime}`,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color;
                switch (status) {
                    case 'Available':
                        color = 'green';
                        break;
                    case 'Booked':
                        color = 'blue';
                        break;
                    case 'Decline':
                        color = 'red';
                        break;
                    default:
                        color = 'default';
                }

                return (
                    <Tag color={color}>
                        {status}
                    </Tag>
                );
            },
        },
        {
            title: 'Reason',
            key: 'reason',
            render: (_, record) => {
                if (record.status === 'Decline') {
                    const reason = record.declineReason || record.reason || 'No reason provided';
                    return (
                        <Tooltip title={reason}>
                            <div className="flex items-center">
                                <span className="truncate max-w-[150px]">{reason}</span>
                                <InfoCircleOutlined className="ml-1" />
                            </div>
                        </Tooltip>
                    );
                }
                return null;
            },
            width: 160,
        },
        {
            title: 'Skin Therapist',
            dataIndex: ['skinTherapist', 'account', 'fullName'],
            key: 'therapistName',
        },
        {
            title: 'Email',
            dataIndex: ['skinTherapist', 'account', 'email'],
            key: 'therapistEmail',
        },
    ];

    return (
        <AccountLayout>
            <>
                <Card
                    title={
                        <div className="flex justify-between items-center">
                            <Button
                                onClick={() => handleMonthChange(-1)}
                                loading={loading}
                            >
                                <LeftOutlined /> Previous Month
                            </Button>

                            <Typography.Title level={4} style={{ margin: 0 }}>
                                {getEnglishMonthName(currentDate)} {currentDate.year()}
                            </Typography.Title>

                            <Button
                                type="primary"
                                onClick={handleSignUpSchedule}
                            >
                                Sign Up Working Schedule
                            </Button>

                            <Button
                                onClick={() => handleMonthChange(1)}
                                loading={loading}
                            >
                                Next Month <RightOutlined />
                            </Button>
                        </div>
                    }
                >
                    <Calendar
                        value={currentDate}
                        dateCellRender={dateCellRender}
                        monthCellRender={monthCellRender}
                        onPanelChange={handlePanelChange}
                        headerRender={() => null}
                        loading={loading}
                    />
                </Card>

                <Modal
                    title={selectedSlotInfo.title}
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    width={1200}
                    footer={[
                        <Button key="close" onClick={() => setModalVisible(false)}>
                            Close
                        </Button>
                    ]}
                    style={{ top: 10 }}
                >
                    {detailsLoading ? (
                        <div className="flex justify-center items-center py-10">
                            <Spin size="large" />
                        </div>
                    ) : (
                        <Table
                            dataSource={scheduleDetails}
                            columns={detailColumns}
                            rowKey="id"
                            pagination={false}
                            scroll={{ x: 800 }}
                        />
                    )}
                </Modal>

                <Modal
                    title="Sign Up Working Schedule"
                    open={signUpModalVisible}
                    onOk={handleRegisterWorkingSchedule}
                    onCancel={() => {
                        setSignUpModalVisible(false);
                        setSelectedSlots([]);
                        setSelectedDates([]);
                    }}
                    okText="Register"
                >
                    <div className="mb-4">
                        <Typography.Text strong>Select Slots</Typography.Text>
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Select slots"
                            value={selectedSlots}
                            onChange={setSelectedSlots}
                        >
                            {slots.map(slot => (
                                <Select.Option key={slot.id} value={slot.id}>
                                    {`Slot ${slot.slotNumber} (${slot.startTime} - ${slot.endTime})`}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <Typography.Text strong>Select Dates</Typography.Text>
                        <DatePicker
                            multiple
                            style={{ width: '100%' }}
                            onChange={(dates) => setSelectedDates(dates)}
                            disabledDate={(current) => {
                                return current && current < dayjs().startOf('day');
                            }}
                        />
                    </div>
                </Modal>

            </>
        </AccountLayout>
    );
};

export default WorkingSchedule;