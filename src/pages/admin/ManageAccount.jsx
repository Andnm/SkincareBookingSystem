import {
  Spin,
  Table,
  Button,
  Avatar,
  Menu,
  Dropdown,
  TableProps,
  Modal,
  Form,
  Upload,
  Input,
  Switch,
  InputNumber,
  Select,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { BiDetail, BiUpload } from "react-icons/bi";
import { VscFolderActive } from "react-icons/vsc";
import { IoIosMore } from "react-icons/io";
import { toast } from "react-toastify";
import { MdBlock } from "react-icons/md";
import { FiTrash2 } from "react-icons/fi";
import { PiPlus } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { userSelector } from "../../redux/selectors/selector";
import { getAllAccounts } from "../../services/user.services";
import {
  generateFallbackAvatar,
  handleActionNotSupport,
} from "../../utils/helpers";
import CreateAccount from "../../components/manage/CreateAccountButton";

const { Option } = Select;
const { confirm } = Modal;
const { Text } = Typography;

const ManageAccount = () => {
  const navigate = useNavigate();
  const userData = useSelector(userSelector);

  const [isLoading, setIsLoading] = useState(false);
  const [processingData, setProcessingData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [typeSearch, setTypeSearch] = useState("email");
  const [orderBy, setOrderBy] = useState("");
  const [isAscending, setIsAscending] = useState(false);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    const fetchItems = async () => {
      if (userData) {
        setIsLoading(true);
        try {
          const params = {
            PageIndex: pageIndex - 1,
            PageSize: pageSize,
            OrderBy: orderBy,
            IsAscending: isAscending,
            Email: typeSearch === "email" ? searchText : "",
            FullName: typeSearch === "fullName" ? searchText : "",
            Status: "",
          };

          const responseGetAllItem = await getAllAccounts(params);
          console.log("responseGetAllItem: ", responseGetAllItem)
          setProcessingData([...responseGetAllItem.data]);
          setTotalRows(responseGetAllItem.totalRows);
        } catch (error) {
          toast.error("There was an error loading data!");
          toast.error(error.response?.data?.message);
          console.error("There was an error loading data!:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchItems();
  }, [searchText, orderBy, isAscending, pageIndex, pageSize]);

  const handlePageChange = (page, pageSize) => {
    setPageIndex(page);
    setPageSize(pageSize);
  };

  const handleAccountCreated = (newAccount) => {
    setProcessingData((prevData) => [newAccount, ...prevData]);
    setTotalRows((prevTotal) => prevTotal + 1);
  };

  const columns = [
    {
      title: "ManageAccount",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={record.avatar_url || generateFallbackAvatar(record.fullName)}
            alt={record.fullName}
            style={{ marginRight: "8px", border: "1px solid #d9d9d9" }}
            size={55}
          />
          <div>
            <div className="text-base">{record.fullName}</div>
            <div className="opacity-70">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      render: (age) =>
        age ? age : <i className="text-xs opacity-70">(Not updated yet)</i>,
    },
    {
      title: "Phone number",
      dataIndex: "phone",
      key: "phone",
      render: (phone) =>
        phone ? phone : <i className="text-xs opacity-70">(Not updated yet)</i>,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender) =>
        gender ? (
          gender
        ) : (
          <i className="text-xs opacity-70">(Not updated yet)</i>
        ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address) =>
        address ? (
          address
        ) : (
          <i className="text-xs opacity-70">(Not updated yet)</i>
        ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => role,
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
                onClick={() => {
                  handleActionNotSupport();
                }}
                icon={<BiDetail style={{ fontSize: "20px" }} />}
                style={{ color: "black" }}
                className="flex items-center"
              >
                Chi tiết
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
      <div className="my-8 flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center">
            <Text strong className="w-30">
              Search by:
            </Text>
            <Select
              value={typeSearch}
              onChange={(value) => setTypeSearch(value)}
              className="w-48"
            >
              <Option value="email">Email</Option>
              <Option value="fullName">Full Name</Option>
            </Select>
            <Input
              placeholder={`Enter ${typeSearch} you want to find`}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-72 "
              style={{ marginLeft: "10px" }}
            />
          </div>

          <div className="flex items-center ml-4">
            <Text strong>Order by:</Text>
            <Select
              defaultValue=""
              className="w-48 ml-4"
              onChange={(value) => setOrderBy(value)}
              style={{ marginLeft: "10px" }}
            >
              <Option value="">Default</Option>
              <Option value="fullName">Full name</Option>
              <Option value="email">Email</Option>
            </Select>
          </div>

          <div className="flex items-center ml-4">
            <Text strong>Sort direction:</Text>
            <Select
              defaultValue="true"
              className="w-36 ml-2"
              onChange={(value) => setIsAscending(value === "true")}
              style={{ marginLeft: "10px" }}
            >
              <Option value="true">Ascending</Option>
              <Option value="false">Descending</Option>
            </Select>
          </div>
        </div>

        <CreateAccount onAccountCreated={handleAccountCreated} />
      </div>

      <div>
        <Spin spinning={isLoading}>
          <Table
            columns={columns}
            dataSource={processingData}
            rowKey={(record) => record.item_id}
            pagination={{
              current: pageIndex,
              pageSize: pageSize,
              total: totalRows,
              onChange: handlePageChange,
            }}
          />
        </Spin>
      </div>
    </div>
  );
};

export default ManageAccount;
