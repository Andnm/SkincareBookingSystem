import React, { useState, useEffect } from 'react';
import { Calendar, Card, Typography, Button, Badge, message } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { getAllWorkingSchedule } from '../../services/workingSchedule.services';

dayjs.locale('vi');

const ManageWorkingSchedule = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [scheduleData, setScheduleData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWorkingSchedules();
  }, []);

  const fetchWorkingSchedules = async () => {
    try {
      setLoading(true);
      const response = await getAllWorkingSchedule();
      
      const formattedSchedules = response?.data?.reduce((acc, schedule) => {
        const [day, month, year] = schedule.workingDate.split('/');
        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        
        if (!acc[formattedDate]) {
          acc[formattedDate] = [];
        }
        
        acc[formattedDate].push({
          ...schedule,
          title: `Slot ${schedule.slotNumber}: ${schedule.startTime} - ${schedule.endTime}`
        });
        
        return acc;
      }, {});

      setScheduleData(formattedSchedules);
    } catch (error) {
      message.error('Failed to fetch working schedules');
      console.error(error);
    } finally {
      setLoading(false);
    }
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
    <Card 
      title={
        <div className="flex justify-between items-center">
          <Button 
            onClick={() => handleMonthChange(-1)}
            loading={loading}
          >
            <LeftOutlined /> Previous Month
          </Button>
          
          <Typography.Title level={4} style={{ margin: 0 }}>
            {getEnglishMonthName(currentDate)} {currentDate.year()}
          </Typography.Title>
          
          <Button 
            onClick={() => handleMonthChange(1)}
            loading={loading}
          >
            Next Month <RightOutlined />
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
        loading={loading}
      />
    </Card>
  );
};

export default ManageWorkingSchedule;