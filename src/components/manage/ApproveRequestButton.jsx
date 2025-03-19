import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Modal, 
  Table, 
  Spin, 
  Space, 
  Form, 
  Input,
  Tag, 
  Tooltip,
  Typography,
  DatePicker,
  Row,
  Col
} from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  InfoCircleOutlined,
  UnorderedListOutlined,
  CalendarOutlined,
  FilterOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { 
  getAllWorkingSchedule, 
  getWorkingScheduleDetailById,
  approveWorkingSchedule,
  declineWorkingSchedule
} from '../../services/workingSchedule.services';

const { Title, Text } = Typography;

const ApproveRequestButton = ({ onApprove, onDecline }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [workingSchedules, setWorkingSchedules] = useState([]);
  const [allSchedules, setAllSchedules] = useState([]);
  const [declineModalVisible, setDeclineModalVisible] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [declineForm] = Form.useForm();

  useEffect(() => {
    if (modalVisible) {
      fetchAllWorkingSchedules();
    }
  }, [modalVisible]);

  useEffect(() => {
    if (allSchedules.length > 0) {
      filterSchedules();
    }
  }, [selectedDate, allSchedules]);

  const fetchAllWorkingSchedules = async () => {
    setLoading(true);
    try {
      const response = await getAllWorkingSchedule();
      
      const allSchedulesData = response?.data || [];
      
      const detailPromises = allSchedulesData.map(item => getWorkingScheduleDetailById(item.id));
      const detailsResponse = await Promise.all(detailPromises);
      
      const pendingSchedules = detailsResponse.filter(schedule => schedule.status === 'Pending');
      
      setAllSchedules(pendingSchedules);
      setWorkingSchedules(pendingSchedules);
    } catch (error) {
      toast.error('Failed to fetch working schedules');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterSchedules = () => {
    if (!selectedDate) {
      setWorkingSchedules(allSchedules);
      return;
    }

    const formattedDate = selectedDate.format('DD/MM/YYYY');
    
    const filtered = allSchedules.filter(schedule => 
      schedule.workingDate === formattedDate
    );
    
    setWorkingSchedules(filtered);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleResetFilter = () => {
    setSelectedDate(null);
  };

  const handleApprove = (id) => {
    Modal.confirm({
      title: 'Approve Working Schedule',
      content: 'Are you sure you want to approve this working schedule?',
      okText: 'Approve',
      okType: 'primary',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          setActionLoading(true);
          await approveWorkingSchedule(id);
          toast.success('Working schedule approved successfully');

          setWorkingSchedules(prev =>
            prev.filter(item => item.id !== id)
          );

          if (onApprove) {
            onApprove();
          }
        } catch (error) {
          toast.error('Failed to approve working schedule');
          console.error(error);
        } finally {
          setActionLoading(false);
        }
      }
    });
  };

  const showDeclineModal = (id) => {
    setSelectedScheduleId(id);
    setDeclineModalVisible(true);
    declineForm.resetFields();
  };

  const handleDeclineSubmit = async () => {
    try {
      const values = await declineForm.validateFields();
      setActionLoading(true);

      await declineWorkingSchedule(selectedScheduleId, { reason: values.reason });
      toast.success('Working schedule declined successfully');

      setWorkingSchedules(prev =>
        prev.filter(item => item.id !== selectedScheduleId)
      );

      setDeclineModalVisible(false);

      if (onDecline) {
        onDecline();
      }
    } catch (error) {
      if (error.errorFields) {
        return;
      }
      toast.error('Failed to decline working schedule');
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'workingDate',
      key: 'workingDate',
    },
    {
      title: 'Slot',
      dataIndex: 'slotNumber',
      key: 'slotNumber',
      render: (text) => `Slot ${text}`,
    },
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
          case 'Pending':
            color = 'orange';
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
      title: 'Skin Therapist',
      dataIndex: ['skinTherapist', 'account', 'fullName'],
      key: 'therapistName',
    },
    {
      title: 'Email',
      dataIndex: ['skinTherapist', 'account', 'email'],
      key: 'therapistEmail',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => handleApprove(record.id)}
            loading={actionLoading && selectedScheduleId === record.id}
          >
            Approve
          </Button>
          <Button
            danger
            icon={<CloseCircleOutlined />}
            onClick={() => showDeclineModal(record.id)}
            loading={actionLoading && selectedScheduleId === record.id}
          >
            Decline
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button 
        type="primary" 
        icon={<UnorderedListOutlined />} 
        onClick={() => setModalVisible(true)}
      >
        Approve Requests
      </Button>

      <Modal
        title={<Title level={4}>Pending Working Schedule Requests</Title>}
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
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div className="mb-4 bg-gray-50 p-4 rounded border">
              <Row gutter={16} align="middle">
                <Col span={6}>
                  <Text strong><FilterOutlined /> Filter by Date:</Text>
                </Col>
                <Col span={8}>
                  <DatePicker 
                    value={selectedDate}
                    onChange={handleDateChange}
                    placeholder="Select date"
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY"
                    allowClear
                  />
                </Col>
                <Col span={4}>
                  <Button onClick={handleResetFilter} disabled={!selectedDate}>
                    Reset Filter
                  </Button>
                </Col>
                <Col span={6}>
                  {selectedDate && (
                    <Text type="secondary">
                      Showing requests for: {selectedDate.format('DD/MM/YYYY')}
                    </Text>
                  )}
                </Col>
              </Row>
            </div>

            {workingSchedules.length > 0 ? (
              <Table
                dataSource={workingSchedules}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 800 }}
              />
            ) : (
              <div className="flex justify-center items-center py-10">
                <Typography.Text>
                  {selectedDate ? 
                    `No pending requests found for ${selectedDate.format('DD/MM/YYYY')}` : 
                    'No pending requests found'}
                </Typography.Text>
              </div>
            )}
          </>
        )}
      </Modal>

      <Modal
        title="Decline Working Schedule"
        open={declineModalVisible}
        onCancel={() => setDeclineModalVisible(false)}
        confirmLoading={actionLoading}
        onOk={handleDeclineSubmit}
        okText="Decline"
        okButtonProps={{ danger: true }}
      >
        <Form form={declineForm} layout="vertical">
          <Form.Item
            name="reason"
            label="Reason for declining"
            rules={[
              { required: true, message: 'Please provide a reason for declining' },
              { min: 3, message: 'Reason must be at least 3 characters' },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Enter the reason for declining this working schedule"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ApproveRequestButton;