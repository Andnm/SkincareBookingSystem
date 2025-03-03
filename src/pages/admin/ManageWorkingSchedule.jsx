import React, { useState } from 'react';

const ManageWorkingSchedule = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  const scheduleData = {
    '2025-03-10': [
      { id: 1, title: 'Slot 1: Họp nhóm' },
      { id: 2, title: 'Slot 2: Gặp khách hàng' },
      { id: 3, title: 'Slot 3: Đánh giá dự án' }
    ],
    '2025-03-15': [
      { id: 1, title: 'Slot 1: Phỏng vấn' },
      { id: 2, title: 'Slot 2: Hội thảo' }
    ],
    '2025-03-20': [
      { id: 1, title: 'Slot 1: Bảo trì hệ thống' },
      { id: 2, title: 'Slot 2: Đào tạo nhân viên' },
      { id: 3, title: 'Slot 3: Tổng kết tuần' }
    ]
  };
  
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };
  
  const changeMonth = (offset) => {
    let newMonth = currentMonth + offset;
    let newYear = currentYear;
    
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };
  
  const formatDate = (day) => {
    const month = currentMonth + 1;
    return `${currentYear}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  };
  
  const months = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];
  
  const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    
    const blanks = [];
    for (let i = 0; i < firstDay; i++) {
      blanks.push(<div key={`blank-${i}`} className="p-2 bg-gray-100 border border-gray-200"></div>);
    }
    
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(day);
      const hasSchedule = scheduleData[dateStr] && scheduleData[dateStr].length > 0;
      
      days.push(
        <div key={day} className="p-2 border border-gray-200 min-h-24">
          <div className="font-bold text-sm">{day}</div>
          {hasSchedule && (
            <div className="mt-1">
              {scheduleData[dateStr].map(slot => (
                <div key={slot.id} className="text-xs bg-blue-100 p-1 mb-1 rounded">
                  {slot.title}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    const totalSlots = [...blanks, ...days];
    const rows = [];
    let cells = [];
    
    totalSlots.forEach((cell, i) => {
      if (i % 7 === 0 && i > 0) {
        rows.push(<div key={`row-${i}`} className="grid grid-cols-7">{cells}</div>);
        cells = [];
      }
      cells.push(cell);
    });
    
    if (cells.length > 0) {
      while (cells.length < 7) {
        cells.push(<div key={`empty-${cells.length}`} className="p-2 bg-gray-100 border border-gray-200"></div>);
      }
      rows.push(<div key="last-row" className="grid grid-cols-7">{cells}</div>);
    }
    
    return rows;
  };
  
  return (
    <div className="p-4 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Quản lý lịch làm việc</h1>
      
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => changeMonth(-1)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          &lt; Tháng trước
        </button>
        
        <div className="text-xl font-bold">
          {months[currentMonth]} {currentYear}
        </div>
        
        <button 
          onClick={() => changeMonth(1)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tháng sau &gt;
        </button>
      </div>
      
      <div className="grid grid-cols-7 bg-gray-200 font-bold">
        {weekdays.map(day => (
          <div key={day} className="p-2 text-center">{day}</div>
        ))}
      </div>
      
      <div className="calendar-body">
        {renderCalendar()}
      </div>
    </div>
  );
};

export default ManageWorkingSchedule;