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
} from "antd";
import { IoIosMore } from "react-icons/io";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { userSelector } from "../../redux/selectors/selector";
import { getAllTransactions } from "../../services/transaction.services";
import TransactionDetailModal from "../../components/manage/TransactionDetailModal";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;

const ManageTransaction = () => {
  const userData = useSelector(userSelector);

  const [isLoading, setIsLoading] = useState(false);
  const [processingData, setProcessingData] = useState([]);

  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  const [name, setName] = useState("");
  const [minTotalAmount, setMinTotalAmount] = useState(null);
  const [maxTotalAmount, setMaxTotalAmount] = useState(null);
  const [fromCreatedDate, setFromCreatedDate] = useState(null);
  const [toCreatedDate, setToCreatedDate] = useState(null);

  const [orderBy, setOrderBy] = useState("");
  const [isAscending, setIsAscending] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (userData) {
        setIsLoading(true);
        try {
          const params = {
            Name: name,
            MinTotalAmount: minTotalAmount,
            MaxTotalAmount: maxTotalAmount,
            FromCreatedDate: fromCreatedDate ? fromCreatedDate.toISOString() : null,
            ToCreatedDate: toCreatedDate ? toCreatedDate.toISOString() : null,
            OrderBy: orderBy,
            IsAscending: isAscending,
            PageIndex: pageIndex - 1,
            PageSize: pageSize,
          };

          const responseGetAllTransactions = await getAllTransactions(params);
          console.log("responseGetAllTransactions: ", responseGetAllTransactions)
          setProcessingData([...responseGetAllTransactions.data]);
          setTotalRows(responseGetAllTransactions.totalRows);
        } catch (error) {
          toast.error("There was an error loading transactions!");
          toast.error(error.response?.data?.message);
          console.error("Error loading transactions:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTransactions();
  }, [
    name,
    minTotalAmount,
    maxTotalAmount,
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

  const handleViewDetails = (transactionId) => {
    setSelectedTransactionId(transactionId);
    setIsDetailModalVisible(true);
  };

  const handleCloseDetailModal = () => {
    setSelectedTransactionId(null);
    setIsDetailModalVisible(false);
  };

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "id",
      key: "id",
      sorter: true,
      render: (id) => <div>{id}</div>,
    },
    {
      title: "Transaction Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      render: (name) => <div>{name}</div>,
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
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
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
        <div className="flex items-center">
          <Text strong className="mr-2 w-50">Transaction Name:</Text>
          <Input
            placeholder="Enter transaction name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-64"
          />
        </div>

        <div className="flex items-center">
          <Text strong className="mr-2">Amount Range:</Text>
          <InputNumber
            placeholder="Min Amount"
            value={minTotalAmount}
            onChange={(value) => setMinTotalAmount(value)}
            className="w-32 mr-2"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
          />
          <InputNumber
            placeholder="Max Amount"
            value={maxTotalAmount}
            onChange={(value) => setMaxTotalAmount(value)}
            className="w-32 mr-2"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
          />
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
            <Option value="name">Transaction Name</Option>
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
          dataSource={processingData}
          rowKey={(record) => record.id}
          pagination={{
            current: pageIndex,
            pageSize: pageSize,
            total: totalRows,
            onChange: handlePageChange,
          }}
        />
      </Spin>

      {isDetailModalVisible && <TransactionDetailModal
        transactionId={selectedTransactionId}
        visible={isDetailModalVisible}
        onClose={handleCloseDetailModal}
      />}

    </div>
  );
};

export default ManageTransaction;