import React from "react";
import { Modal, Button, Form, Input, Rate } from "antd";

const { TextArea } = Input;

const FeedbackModal = ({ visible, onCancel, onSubmit, loading }) => {
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
      title="Rate Your Experience"
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
          Submit Feedback
        </Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
      >
        <Form.Item
          name="rating"
          label="Rate your experience"
          rules={[{ required: true, message: 'Please select a rating' }]}
        >
          <Rate allowHalf />
        </Form.Item>
        <Form.Item
          name="comment"
          label="Comments (Optional)"
          rules={[{ required: true, message: 'Please enter your comment' }]}
        >
          <TextArea
            rows={4}
            placeholder="Tell us about your experience. What did you like? What could be improved?"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FeedbackModal;