import React, { useState } from 'react';
import { Calendar, Card, Typography, Button, Badge } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import AccountLayout from '../../components/layout/AccountLayout';

dayjs.locale('vi');

const WorkingSchedule = () => {
    const [currentDate, setCurrentDate] = useState(dayjs());

    const scheduleData = {
        '2025-03-10': [
            { id: 1, title: 'Slot 1: Team Meeting' },
            { id: 2, title: 'Slot 2: Client Meeting' },
            { id: 3, title: 'Slot 3: Project Evaluation' }
        ],
        '2025-03-15': [
            { id: 1, title: 'Slot 1: Interview' },
            { id: 2, title: 'Slot 2: Workshop' }
        ],
        '2025-03-20': [
            { id: 1, title: 'Slot 1: System Maintenance' },
            { id: 2, title: 'Slot 2: Staff Training' },
            { id: 3, title: 'Slot 3: Weekly Summary' }
        ]
    };

    const dateCellRender = (value) => {
        const dateString = value.format('YYYY-MM-DD');
        const schedules = scheduleData[dateString];

        if (schedules) {
            return (
                <div>
                    {schedules.map(slot => (
                        <Badge
                            key={slot.id}
                            status="processing"
                            text={slot.title}
                            className="block mb-1 text-xs"
                        />
                    ))}
                </div>
            );
        }
        return null;
    };

    const monthCellRender = (value) => {
        const month = value.month();
        const year = value.year();

        let totalSchedules = 0;
        Object.keys(scheduleData).forEach(dateStr => {
            const scheduleDate = dayjs(dateStr);
            if (scheduleDate.year() === year && scheduleDate.month() === month) {
                totalSchedules += scheduleData[dateStr].length;
            }
        });

        return totalSchedules > 0 ? (
            <div className="notes-month">
                <Typography.Text type="secondary">
                    {totalSchedules} tasks
                </Typography.Text>
            </div>
        ) : null;
    };

    const handlePanelChange = (date) => {
        setCurrentDate(date);
    };

    const handleMonthChange = (offset) => {
        const newDate = currentDate.clone().add(offset, 'month');
        setCurrentDate(newDate);
    };

    const getEnglishMonthName = (date) => {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return monthNames[date.month()];
    };

    return (
        <AccountLayout>
            <Card
                title={
                    <div className="flex justify-between items-center">
                        <Button
                            onClick={() => handleMonthChange(-1)}
                        >
                            Previous Month
                        </Button>

                        <Typography.Title level={4} style={{ margin: 0 }}>
                            {getEnglishMonthName(currentDate)} {currentDate.year()}
                        </Typography.Title>

                        <Button
                            onClick={() => handleMonthChange(1)}
                        >
                            Next Month
                        </Button>
                    </div>
                }
            >
                <Calendar
                    value={currentDate}
                    dateCellRender={dateCellRender}
                    monthCellRender={monthCellRender}
                    onPanelChange={handlePanelChange}
                    headerRender={() => null}
                />
            </Card>
        </AccountLayout>

    );
};

export default WorkingSchedule;