import React from "react";
import { Card, Descriptions, List, Typography, Spin, Rate } from "antd";
import { StarOutlined, CommentOutlined } from "@ant-design/icons";

const { Text, Paragraph } = Typography;

const BookingSlotExpandedRow = ({ record, slotDetails }) => {
  if (record.status?.toLowerCase() !== "done") {
    return <Text type="secondary">Details only available for completed sessions</Text>;
  }

  const slotDetail = slotDetails[record.id];
  console.log("Rendering expanded row for slot ID:", record.id);
  console.log("Slot details from state:", slotDetail);

  if (!slotDetail) {
    return (
      <div className="p-4 text-center">
        <Spin tip="Loading details..." />
      </div>
    );
  }

  return (
    <div className="expanded-details p-4">
      {slotDetail.result && (
        <Card title="Treatment Result" className="mb-4" size="small" style={{ marginBottom: "20px" }}>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Content">{slotDetail.result.content}</Descriptions.Item>
            <Descriptions.Item label="Description">{slotDetail.result.description}</Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {slotDetail.ratings && slotDetail.ratings.length > 0 && (
        <Card title="Ratings" className="mb-4" size="small" style={{ marginBottom: "20px" }}>
          <List
            dataSource={slotDetail.ratings}
            renderItem={(rating) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<StarOutlined style={{ color: "#faad14" }} />}
                  title={
                    <div>
                      <Rate disabled defaultValue={rating.star} />
                      <Text className="ml-2" type="secondary">
                        by {rating.creator || "Customer"}
                      </Text>
                    </div>
                  }
                  description={`Slot ${rating.slotNumber} (${rating.startTime} - ${rating.endTime})`}
                />
              </List.Item>
            )}
          />
        </Card>
      )}

      {slotDetail.feedbacks && slotDetail.feedbacks.length > 0 && (
        <Card title="Feedback Comments" size="small">
          <List
            dataSource={slotDetail.feedbacks}
            renderItem={(feedback) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<CommentOutlined />}
                  title={<Text strong>{feedback.creator || "Customer"}</Text>}
                  description={
                    <>
                      <Paragraph>{feedback.comment}</Paragraph>
                      <Text type="secondary" className="text-xs">
                        Slot {feedback.slotNumber} ({feedback.startTime} - {feedback.endTime})
                      </Text>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}

      {!slotDetail.result && !slotDetail.ratings?.length && !slotDetail.feedbacks?.length && (
        <Text type="secondary">No additional details available for this booking slot</Text>
      )}
    </div>
  );
};

export default BookingSlotExpandedRow;