import React from "react";
import { Modal, Button, Form, Input } from "antd";

const { TextArea } = Input;

const TreatmentNoteModal = ({ visible, onCancel, onSubmit, loading }) => {
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = () => {
    form.submit();
  };

  return (
    <Modal
      title="Add Treatment Notes"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
      >
        <Form.Item
          name="content"
          label="Treatment Notes"
          rules={[{ required: true, message: 'Please enter treatment notes' }]}
        >
          <TextArea rows={4} placeholder="Enter detailed treatment notes" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Additional Comments"
          rules={[{ required: true, message: 'Please enter additional comments' }]}
        >
          <TextArea rows={2} placeholder="Any additional comments or recommendations" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TreatmentNoteModal;