import React, { useState, useEffect } from 'react';
import { Modal, Descriptions, Spin, Typography, Tag } from 'antd';
import { toast } from 'react-toastify';
import { getTransactionDetail } from '../../services/transaction.services';

const { Text } = Typography;

const TransactionDetailModal = ({ transactionId, visible, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [transactionDetail, setTransactionDetail] = useState(null);

    useEffect(() => {
        const fetchTransactionDetail = async () => {
            if (visible && transactionId) {
                setLoading(true);
                try {
                    const detail = await getTransactionDetail(transactionId);
                    setTransactionDetail(detail);
                } catch (error) {
                    toast.error("Failed to fetch transaction details");
                    console.error("Error fetching transaction details:", error);
                    onClose();
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchTransactionDetail();
    }, [transactionId, visible]);

    const renderTransactionStatus = (status) => {
        const isSuccess = status === "True";
        return (
            <Tag color={isSuccess ? "green" : "red"}>
                {isSuccess ? "Successful" : "Failed"}
            </Tag>
        );
    };

    return (
        <Modal
            title="Transaction Details"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Spin size="large" />
                </div>
            ) : transactionDetail ? (
                <Descriptions
                    bordered
                    column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
                >
                    <Descriptions.Item label="Transaction ID">
                        {transactionDetail.id}
                    </Descriptions.Item>
                    <Descriptions.Item label="Transaction Name">
                        {transactionDetail.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Total Amount">
                        {transactionDetail.totalAmount.toLocaleString()} {transactionDetail.moneyUnit}
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {transactionDetail.createdAt}
                    </Descriptions.Item>
                    <Descriptions.Item label="VNPay TMN Code">
                        {transactionDetail.vnPayTmnCode}
                    </Descriptions.Item>
                    <Descriptions.Item label="VNPay Transaction Reference">
                        {transactionDetail.vnPayTxnRef}
                    </Descriptions.Item>
                    <Descriptions.Item label="Order Info">
                        {transactionDetail.vnPayOrderInfo}
                    </Descriptions.Item>
                    <Descriptions.Item label="Bank Code">
                        {transactionDetail.vnpayBankCode}
                    </Descriptions.Item>
                    <Descriptions.Item label="Bank Transaction Number">
                        {transactionDetail.vnpayBankTranNo}
                    </Descriptions.Item>
                    <Descriptions.Item label="Card Type">
                        {transactionDetail.vnpayCardType}
                    </Descriptions.Item>
                    <Descriptions.Item label="VNPay Transaction Number">
                        {transactionDetail.vnpayTransactionNo}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                        {renderTransactionStatus(transactionDetail.status)}
                    </Descriptions.Item>
                </Descriptions>
            ) : null}
        </Modal>
    );
};

export default TransactionDetailModal;