import React, { useState, useEffect } from "react";
import { DatePicker, Radio } from "antd";
import { Bar, Line } from "react-chartjs-2";
import dayjs from "dayjs";
import "dayjs/locale/vi";

const { WeekPicker, MonthPicker } = DatePicker;

const DataChart = ({
  data,
  chartType = "bar", // "bar" hoặc "line"
  chartTitle = "Biểu Đồ Dữ Liệu",
  dataLabel = "Dữ liệu",
  valueKey = "value", // Khóa chứa giá trị (ví dụ: "amount" hoặc "count")
  countKey = "count", // Khóa chứa số lượng (chỉ hiển thị nếu khác với valueKey)
  valueFormatter = (value) => value.toString(), // Định dạng hiển thị giá trị
  tooltipValueLabel = "Giá trị", // Nhãn tooltip cho giá trị
  summaryValueLabel = "Tổng giá trị", // Nhãn tổng kết cho giá trị
  summaryCountLabel = "Tổng số lượng", // Nhãn tổng kết cho số lượng (chỉ hiển thị nếu countKey khác valueKey)
  mainColor = "rgba(75, 192, 192, 1)", // Màu sắc chính của biểu đồ
  dateField = "createdAt", // Tên trường chứa ngày tháng trong dữ liệu
  showCount = true, // Có hiển thị số lượng không
  yAxisOptions = {}, // Tùy chọn bổ sung cho trục y
  chartOptions = {}, // Tùy chọn bổ sung cho biểu đồ
}) => {
  const [viewMode, setViewMode] = useState("month"); // "week", "month", "year"
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [filteredData, setFilteredData] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  dayjs.locale("vi");

  const getWeekRange = (date) => {
    const startOfWeek = date.startOf("week");
    const endOfWeek = date.endOf("week");
    return { startOfWeek, endOfWeek };
  };

  const getMonthRange = (date) => {
    const startOfMonth = date.startOf("month");
    const endOfMonth = date.endOf("month");
    return { startOfMonth, endOfMonth };
  };

  const getYearRange = (date) => {
    const startOfYear = date.startOf("year");
    const endOfYear = date.endOf("year");
    return { startOfYear, endOfYear };
  };

  const processData = (timeRange, startDate, endDate) => {
    if (!data || data.length === 0) return [];
    
    let periodData;
    let periodLength;
    
    // Xác định số lượng mục dữ liệu và ngày bắt đầu dựa vào chế độ xem
    switch (timeRange) {
      case "week":
        periodLength = 7;
        periodData = Array(periodLength).fill(0).map((_, index) => {
          const day = startDate.add(index, "day");
          return {
            date: day.format("YYYY-MM-DD"),
            label: day.format("DD/MM (ddd)"),
            [valueKey]: 0,
            count: 0,
          };
        });
        break;
      case "month":
        periodLength = endDate.date();
        periodData = Array(periodLength).fill(0).map((_, index) => {
          const day = startDate.add(index, "day");
          return {
            date: day.format("YYYY-MM-DD"),
            label: day.format("DD/MM"),
            [valueKey]: 0,
            count: 0,
          };
        });
        break;
      case "year":
        periodLength = 12;
        periodData = Array(periodLength).fill(0).map((_, index) => {
          const month = startDate.add(index, "month");
          return {
            date: month.format("YYYY-MM"),
            label: month.format("MM/YYYY"),
            [valueKey]: 0,
            count: 0,
          };
        });
        break;
      default:
        return [];
    }
    
    let totalValueSum = 0;
    let totalCountSum = 0;
    
    // Lọc và tổng hợp dữ liệu theo khoảng thời gian
    data.forEach((item) => {
      const itemDate = dayjs(item[dateField]);
      
      if (itemDate.isBetween(startDate, endDate, null, "[]")) {
        let index;
        
        switch (timeRange) {
          case "week":
            index = itemDate.day();
            break;
          case "month":
            index = itemDate.date() - 1;
            break;
          case "year":
            index = itemDate.month();
            break;
          default:
            return;
        }
        
        // Cập nhật giá trị
        const itemValue = item[valueKey] || 0;
        periodData[index][valueKey] += itemValue;
        periodData[index].count += 1;
        
        totalValueSum += itemValue;
        totalCountSum += 1;
      }
    });
    
    setTotalValue(totalValueSum);
    setTotalCount(totalCountSum);
    
    return periodData;
  };

  useEffect(() => {
    if (data && data.length > 0) {
      let startDate, endDate;
      
      switch (viewMode) {
        case "week": {
          const { startOfWeek, endOfWeek } = getWeekRange(selectedDate);
          startDate = startOfWeek;
          endDate = endOfWeek;
          break;
        }
        case "month": {
          const { startOfMonth, endOfMonth } = getMonthRange(selectedDate);
          startDate = startOfMonth;
          endDate = endOfMonth;
          break;
        }
        case "year": {
          const { startOfYear, endOfYear } = getYearRange(selectedDate);
          startDate = startOfYear;
          endDate = endOfYear;
          break;
        }
        default:
          return;
      }
      
      const processedData = processData(viewMode, startDate, endDate);
      setFilteredData(processedData);
    }
  }, [data, selectedDate, viewMode, valueKey]);

  // Chuẩn bị dữ liệu cho biểu đồ
  const chartData = {
    labels: filteredData.map((item) => item.label),
    datasets: [
      {
        label: dataLabel,
        data: filteredData.map((item) => item[valueKey]),
        backgroundColor: mainColor.replace("1)", "0.6)"),
        borderColor: mainColor,
        borderWidth: 1,
        tension: chartType === "line" ? 0.4 : 0,
        fill: chartType === "line" ? false : undefined,
        pointRadius: chartType === "line" ? 4 : 0,
        pointBackgroundColor: chartType === "line" ? mainColor : undefined,
      },
    ],
  };

  // Tùy chọn mặc định cho biểu đồ
  const defaultChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return valueFormatter(value);
          },
        },
        ...yAxisOptions,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw;
            return `${tooltipValueLabel}: ${valueFormatter(value)}`;
          },
          afterLabel: function (context) {
            if (countKey !== valueKey && showCount) {
              const index = context.dataIndex;
              return `${summaryCountLabel}: ${filteredData[index].count}`;
            }
            return null;
          },
        },
      },
      legend: {
        display: true,
        position: "top",
      },
    },
    ...chartOptions,
  };

  const handleViewModeChange = (e) => {
    setViewMode(e.target.value);
  };

  const handleDateChange = (date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const renderTitle = () => {
    const modeText = {
      week: "Theo Ngày Trong Tuần",
      month: "Theo Ngày Trong Tháng",
      year: "Theo Tháng Trong Năm",
    };
    
    return `${chartTitle} ${modeText[viewMode] || ""}`;
  };

  const renderDatePicker = () => {
    switch (viewMode) {
      case "week":
        return (
          <WeekPicker
            value={selectedDate}
            onChange={handleDateChange}
            placeholder="Chọn tuần"
            format="YYYY-[Tuần]ww"
          />
        );
      case "month":
        return (
          <MonthPicker
            value={selectedDate}
            onChange={handleDateChange}
            placeholder="Chọn tháng"
            format="MM/YYYY"
          />
        );
      case "year":
        return (
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            picker="year"
            placeholder="Chọn năm"
            disabledDate={(current) => current && current.year() < 2025}
          />
        );
      default:
        return null;
    }
  };

  const renderTimeRangeInfo = () => {
    switch (viewMode) {
      case "week": {
        const { startOfWeek, endOfWeek } = getWeekRange(selectedDate);
        return `${startOfWeek.format("DD/MM/YYYY")} - ${endOfWeek.format("DD/MM/YYYY")}`;
      }
      case "month": {
        const { startOfMonth, endOfMonth } = getMonthRange(selectedDate);
        return `${startOfMonth.format("DD/MM/YYYY")} - ${endOfMonth.format("DD/MM/YYYY")}`;
      }
      case "year": {
        const { startOfYear, endOfYear } = getYearRange(selectedDate);
        return `${startOfYear.format("DD/MM/YYYY")} - ${endOfYear.format("DD/MM/YYYY")}`;
      }
      default:
        return "";
    }
  };

  const ChartComponent = chartType === "line" ? Line : Bar;

  return (
    <div className="data-chart">
      <div className="chart-header">
        <h2>{renderTitle()}</h2>
        <div className="date-filters">
          <Radio.Group value={viewMode} onChange={handleViewModeChange}>
            <Radio.Button value="week">Tuần</Radio.Button>
            <Radio.Button value="month">Tháng</Radio.Button>
            <Radio.Button value="year">Năm</Radio.Button>
          </Radio.Group>
          {renderDatePicker()}
        </div>
      </div>
      
      <div className="chart-summary">
        {valueKey !== countKey && (
          <div className="summary-item">
            <h3>{summaryValueLabel}:</h3>
            <p>{valueFormatter(totalValue)}</p>
          </div>
        )}
        <div className="summary-item">
          <h3>{summaryCountLabel}:</h3>
          <p>{totalCount}</p>
        </div>
        <div className="summary-item">
          <h3>Khoảng thời gian:</h3>
          <p>{renderTimeRangeInfo()}</p>
        </div>
      </div>
      
      <div className="chart-container">
        <ChartComponent data={chartData} options={defaultChartOptions} height={300} />
      </div>
    </div>
  );
};

export default DataChart;