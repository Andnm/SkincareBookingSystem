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
import SearchFilterHeader from "../../components/manage/SearchFilterHeader";
import {
  getAllAccounts,
  getAllUserByAdmin,
} from "../../services/user.services";
import {
  generateFallbackAvatar,
  handleActionNotSupport,
} from "../../utils/helpers";

const { confirm } = Modal;

const Account = () => {
  const navigate = useNavigate();
  const userData = useSelector(userSelector);

  const [isLoading, setIsLoading] = useState(false);
  const [originalData, setOriginalData] = useState([]);
  const [processingData, setProcessingData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(undefined);
  const [uploading, setUploading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    const fetchItems = async () => {
      if (userData) {
        setIsLoading(true);
        try {
          const data = {
            pageIndex: pageIndex - 1,
            pageSize: pageSize,
            orderBy: "",
            isAscending: true,
            email: searchText,
            fullName: "",
            status: "",
          };

          const responseGetAllItem = await getAllAccounts(data);
          console.log("responseGetAllItem: ", responseGetAllItem);
          setOriginalData([...responseGetAllItem.data]);
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
  }, [userData, pageIndex, pageSize, searchText]);

  const handlePageChange = (page, pageSize) => {
    setPageIndex(page);
    setPageSize(pageSize);
  };

  const columns = [
    {
      title: "Account",
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
        gender ? gender : <i className="text-xs opacity-70">(Not updated yet)</i>,
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
      title: "Hội viên",
      dataIndex: "membership",
      key: "membership",
      render: (membership) => membership,
    },
    {
      title: "Hành động",
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
    <div>
      <div className="mt-8">
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

export default Account;
