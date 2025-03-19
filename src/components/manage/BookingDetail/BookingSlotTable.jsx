import React from "react";
import { Table, Typography } from "antd";
import { DownOutlined } from "@ant-design/icons";

import ActionButtons from "./ActionButtons";
import BookingSlotExpandedRow from "./BookingSlotExpandedRow";
import { getStatusTag } from "../../../utils/helpers";

const { Text } = Typography;

const BookingSlotTable = ({
  bookingSlots,
  expandedRowKeys,
  onExpandRow,
  slotDetails,
  handleCheckIn,
  handleCheckOut,
  openNoteModal,
  openFeedbackModal,
  actionLoading,
  userRole,
  isCustomer,
  isSkinTherapist,
  isStaffOrManager
}) => {
  const bookingSlotColumns = [
    {
      title: "Date",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (text) => text
    },
    {
      title: "Slot",
      dataIndex: "slotNumber",
      key: "slotNumber",
      render: (text) => `Slot ${text}`
    },
    {
      title: "Time",
      key: "time",
      render: (_, record) => `${record.startTime} - ${record.endTime}`
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status)
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <ActionButtons
          record={record}
          userRole={userRole}
          isCustomer={isCustomer}
          isSkinTherapist={isSkinTherapist}
          isStaffOrManager={isStaffOrManager}
          actionLoading={actionLoading}
          handleCheckIn={handleCheckIn}
          handleCheckOut={handleCheckOut}
          openNoteModal={openNoteModal}
          openFeedbackModal={openFeedbackModal}
        />
      )
    }
  ];

  return (
    <Table
      dataSource={bookingSlots}
      columns={bookingSlotColumns}
      rowKey="id"
      pagination={false}
      expandable={{
        expandedRowRender: (record) => (
          <BookingSlotExpandedRow 
            record={record} 
            slotDetails={slotDetails} 
          />
        ),
        expandRowByClick: true,
        expandedRowKeys,
        onExpand: onExpandRow,
        expandIcon: ({ expanded, onExpand, record }) => {
          if (record.status?.toLowerCase() === "done") {
            return expanded ? (
              <DownOutlined
                rotate={180}
                onClick={(e) => {
                  e.stopPropagation();
                  onExpand(record, e);
                }}
              />
            ) : (
              <DownOutlined
                onClick={(e) => {
                  e.stopPropagation();
                  onExpand(record, e);
                }}
              />
            );
          }
          return null;
        },
        rowExpandable: (record) => record.status?.toLowerCase() === "done"
      }}
    />
  );
};

export default BookingSlotTable;