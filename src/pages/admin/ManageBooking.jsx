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
import BookingDetailModal from "../../components/manage/BookingDetailModal";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;

const ManageBooking = () => {
  const userData = useSelector(userSelector);

  const [isLoading, setIsLoading] = useState(false);
  const [bookingData, setBookingData] = useState([]);

  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  const [paymentStatus, setPaymentStatus] = useState("");
  const [totalAmount, setTotalAmount] = useState(null);
  const [fromCreatedDate, setFromCreatedDate] = useState(null);
  const [toCreatedDate, setToCreatedDate] = useState(null);

  const [orderBy, setOrderBy] = useState("");
  const [isAscending, setIsAscending] = useState(true);
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
            FromCreatedDate: fromCreatedDate ? fromCreatedDate.toISOString() : null,
            ToCreatedDate: toCreatedDate ? toCreatedDate.toISOString() : null,
            OrderBy: orderBy,
            IsAscending: isAscending,
            PageIndex: pageIndex - 1,
            PageSize: pageSize,
          };

          const responseGetAllBookings = await getAllBookings(params);
          console.log("responseGetAllBookings: ", responseGetAllBookings)
          setBookingData([...responseGetAllBookings.data]);
          setTotalRows(responseGetAllBookings.totalRows);
        } catch (error) {
          toast.error("There was an error loading bookings!");
          toast.error(error.response?.data?.message);
          console.error("Error loading bookings:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchBookings();
  }, [
    totalAmount,
    fromCreatedDate,
    toCreatedDate,
    orderBy,
    isAscending,
    pageIndex,
    pageSize,
    userData
  ]);

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
      sorter: true,
      render: (id) => <div className="truncate max-w-xs">{id}</div>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: true,
      render: (status) => getStatusTag(status),
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      sorter: true,
      render: (paymentStatus) => getStatusTag(paymentStatus),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      sorter: true,
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
    <div className="p-4">
      <div className="my-8 flex flex-wrap items-center justify-between gap-4">
        {/* <div className="flex items-center">
          <Text strong className="mr-2 w-32">Payment Status:</Text>
          <Select
            placeholder="Select payment status"
            value={paymentStatus}
            onChange={(value) => setPaymentStatus(value)}
            allowClear
            className="w-48"
          >
            <Option value="done">Done</Option>
            <Option value="incomplete">Incomplete</Option>
          </Select>
        </div> */}

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
          <RangePicker
            onChange={(dates) => {
              setFromCreatedDate(dates?.[0]);
              setToCreatedDate(dates?.[1]);
            }}
          />
        </div>

        <div className="flex items-center">
          <Text strong className="mr-2">Sort By:</Text>
          <Select
            value={orderBy}
            onChange={(value) => setOrderBy(value)}
            className="w-48 mr-2"
          >
            <Option value="">Default</Option>
            <Option value="paymentStatus">Payment Status</Option>
            <Option value="totalAmount">Total Amount</Option>
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
          dataSource={bookingData}
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
  );
};

export default ManageBooking;