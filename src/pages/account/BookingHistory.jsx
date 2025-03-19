import React, { useEffect, useState } from "react";
import {
    Spin,
    Table,
    Button,
    Menu,
    Dropdown,
    Input,
    Select,
    Typography,
    DatePicker,
    InputNumber,
    Tag
} from "antd";
import { IoIosMore } from "react-icons/io";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { userSelector } from "../../redux/selectors/selector";
import { getAllBookings } from "../../services/booking.services";
import { handleActionNotSupport } from "../../utils/helpers";
import { IdcardOutlined } from "@ant-design/icons";
import AccountLayout from "../../components/layout/AccountLayout";
import dayjs from "dayjs";
import BookingDetailModal from "../../components/manage/BookingDetail/BookingDetailModal";

const { Option } = Select;
const { Text } = Typography;

const BookingHistory = () => {
    const userData = useSelector(userSelector);

    const [isLoading, setIsLoading] = useState(false);
    const [allBookingData, setAllBookingData] = useState([]); 
    const [filteredBookingData, setFilteredBookingData] = useState([]); 

    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

    const [paymentStatus, setPaymentStatus] = useState("");
    const [totalAmount, setTotalAmount] = useState(null);
    const [fromCreatedDate, setFromCreatedDate] = useState(dayjs()); 

    const [orderBy, setOrderBy] = useState("");
    const [isAscending, setIsAscending] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRows, setTotalRows] = useState(0);

    useEffect(() => {
        const fetchBookings = async () => {
            if (userData) {
                setIsLoading(true);
                try {
                    const params = {
                        TotalAmount: totalAmount,
                        OrderBy: orderBy,
                        IsAscending: isAscending,
                        PageIndex: 0, 
                        PageSize: 1000, 
                    };

                    const responseGetAllBookings = await getAllBookings(params);
                    setAllBookingData([...responseGetAllBookings.data]);
                } catch (error) {
                    toast.error(error.response?.data?.message);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchBookings();
    }, [
        totalAmount,
        orderBy,
        isAscending,
        userData
    ]);

    useEffect(() => {
        let filtered = [...allBookingData];

        if (fromCreatedDate) {
            const selectedDate = fromCreatedDate.format('DD/MM/YYYY');
            
            filtered = filtered.filter(booking => {
                const bookingDate = booking.createdAt ? booking.createdAt.split(' ')[0] : '';
                return bookingDate === selectedDate;
            });
        }

        if (totalAmount !== null) {
            filtered = filtered.filter(booking => booking.totalAmount === totalAmount);
        }

        if (orderBy) {
            filtered.sort((a, b) => {
                let valueA = a[orderBy];
                let valueB = b[orderBy];
                
                if (typeof valueA === 'string') {
                    valueA = valueA.toLowerCase();
                    valueB = valueB.toLowerCase();
                }
                
                if (valueA < valueB) return isAscending ? -1 : 1;
                if (valueA > valueB) return isAscending ? 1 : -1;
                return 0;
            });
        }

        setTotalRows(filtered.length);
        
        const start = (pageIndex - 1) * pageSize;
        const paginatedData = filtered.slice(start, start + pageSize);
        
        setFilteredBookingData(paginatedData);
    }, [allBookingData, fromCreatedDate, totalAmount, orderBy, isAscending, pageIndex, pageSize]);

    const handlePageChange = (page, pageSize) => {
        setPageIndex(page);
        setPageSize(pageSize);
    };

    const handleViewDetails = (bookingId) => {
        setSelectedBookingId(bookingId);
        setIsDetailModalVisible(true);
    };

    const handleCloseDetailModal = () => {
        setSelectedBookingId(null);
        setIsDetailModalVisible(false);
    };

    const getStatusTag = (paymentStatus) => {
        let color = "";
        switch (paymentStatus?.toLowerCase()) {
            case "done":
                color = "green";
                break;
            case "incomplete":
                color = "red";
                break;
            default:
                color = "blue";
        }
        return <Tag color={color}>{paymentStatus}</Tag>;
    };

    const columns = [
        {
            title: "Booking ID",
            dataIndex: "id",
            key: "id",
            render: (id) => <div className="truncate max-w-xs">{id}</div>,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => getStatusTag(status),
        },
        {
            title: "Payment Status",
            dataIndex: "paymentStatus",
            key: "paymentStatus",
            render: (paymentStatus) => getStatusTag(paymentStatus),
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
        },
        {
            title: "Total Amount",
            dataIndex: "totalAmount",
            key: "totalAmount",
            render: (amount, record) =>
                `${amount.toLocaleString()} ${record.moneyUnit}`,
        },
        {
            title: "Book for Themself",
            dataIndex: "bookForCustomerAccountOwner",
            key: "bookForCustomerAccountOwner",
            render: (value) => (value ? "Yes" : "No"),
        },
        {
            title: "Actions",
            key: "actions",
            align: "center",
            render: (text, record) => {
                const menu = (
                    <Menu>
                        <Menu.Item key="view">
                            <Button
                                type="link"
                                onClick={() => handleViewDetails(record.id)}
                                className="flex items-center"
                            >
                                View Details
                            </Button>
                        </Menu.Item>
                        {record.paymentURL && (
                            <Menu.Item key="payment">
                                <Button
                                    type="link"
                                    onClick={() => window.open(record.paymentURL, "_blank")}
                                    className="flex items-center"
                                >
                                    Go to Payment
                                </Button>
                            </Menu.Item>
                        )}
                    </Menu>
                );

                return (
                    <Dropdown overlay={menu} trigger={["click"]}>
                        <Button
                            type="link"
                            icon={<IoIosMore style={{ fontSize: "24px" }} />}
                        />
                    </Dropdown>
                );
            },
        },
    ];

    return (
        <AccountLayout>
            <div className="bg-white rounded-lg shadow-md p-6 h-full">
                <div className="my-8 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center">
                        <Text strong className="mr-2">Total Amount:</Text>
                        <InputNumber
                            placeholder="Amount"
                            value={totalAmount}
                            onChange={(value) => setTotalAmount(value)}
                            className="w-32 mr-2"
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value?.replace(/\$\s?|(,*)/g, '')} />
                    </div>

                    <div className="flex items-center">
                        <Text strong className="mr-2">Created Date:</Text>
                        <DatePicker
                            value={fromCreatedDate}
                            onChange={(date) => setFromCreatedDate(date)}
                            allowClear={false}
                            format="DD/MM/YYYY"
                        />
                    </div>

                    <div className="flex items-center">
                        <Text strong className="mr-2">Sort By:</Text>
                        <Select
                            value={orderBy}
                            onChange={(value) => setOrderBy(value)}
                            className="w-35 mr-2"
                        >
                            <Option value="">Default</Option>
                            <Option value="paymentStatus">Payment Status</Option>
                            <Option value="totalAmount">Total Amount</Option>
                            <Option value="createdAt">Created Date</Option>
                        </Select>
                        <Select
                            value={isAscending.toString()}
                            onChange={(value) => setIsAscending(value === "true")}
                            className="w-36 mr-2"
                        >
                            <Option value="true">Ascending</Option>
                            <Option value="false">Descending</Option>
                        </Select>
                    </div>
                </div>

                <Spin spinning={isLoading}>
                    <Table
                        columns={columns}
                        dataSource={filteredBookingData}
                        rowKey={(record) => record.id}
                        pagination={{
                            current: pageIndex,
                            pageSize: pageSize,
                            total: totalRows,
                            onChange: handlePageChange,
                        }}
                    />
                </Spin>

                <BookingDetailModal
                    bookingId={selectedBookingId}
                    visible={isDetailModalVisible}
                    onClose={handleCloseDetailModal}
                />
            </div>
        </AccountLayout>
    );
};

export default BookingHistory;