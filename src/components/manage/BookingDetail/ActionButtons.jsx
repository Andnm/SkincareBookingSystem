import React from "react";
import { Button, Tooltip } from "antd";
import {
  LoginOutlined,
  LogoutOutlined,
  FileTextOutlined,
  StarOutlined
} from "@ant-design/icons";

const ActionButtons = ({
  record,
  userRole,
  isCustomer,
  isSkinTherapist,
  isStaffOrManager,
  actionLoading,
  handleCheckIn,
  handleCheckOut,
  openNoteModal,
  openFeedbackModal
}) => {
  const status = record.status?.toLowerCase();

  if (isStaffOrManager) {
    if (status === "pending") {
      return (
        <Button
          type="primary"
          size="small"
          icon={<LoginOutlined />}
          loading={actionLoading}
          onClick={() => handleCheckIn(record.id)}
        >
          Check In
        </Button>
      );
    } else if (status === "in_progress") {
      return (
        <Button
          type="primary"
          size="small"
          icon={<LogoutOutlined />}
          loading={actionLoading}
          onClick={() => handleCheckOut(record.id)}
        >
          Check Out
        </Button>
      );
    } else {
      return (
        <Tooltip title="No action available for this status">
          <Button type="default" size="small" disabled>
            {status === "checked-out" || status === "done" ? "Completed" : "No Action"}
          </Button>
        </Tooltip>
      );
    }
  } else if (isSkinTherapist) {
    if (status === "in_progress") {
      return (
        <Button
          type="primary"
          size="small"
          icon={<FileTextOutlined />}
          onClick={() => openNoteModal(record.id)}
          loading={actionLoading}
        >
          Add Notes
        </Button>
      );
    } else {
      return (
        <Tooltip
          title={
            status === "checked-out" || status === "done"
              ? "Session completed"
              : "Patient not checked in yet"
          }
        >
          <Button type="default" size="small" disabled>
            {status === "checked-out" || status === "done"
              ? "Completed"
              : "Waiting for check-in"}
          </Button>
        </Tooltip>
      );
    }
  } else if (isCustomer) {
    if (status === "checked-out" || status === "done") {
      return (
        <Button
          type="primary"
          size="small"
          icon={<StarOutlined />}
          onClick={() => openFeedbackModal(record.id)}
          loading={actionLoading}
        >
          Add Feedback
        </Button>
      );
    }
  }

  return null;
};

export default ActionButtons;