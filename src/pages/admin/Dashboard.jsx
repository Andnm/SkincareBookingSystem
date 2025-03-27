import TodaySalesSummary from "../../components/dashboard/dashboardChart/TodaySalesSummary";
import VisitorsChart from "../../components/dashboard/dashboardChart/VisitorsChart";
import RevenueChart from "../../components/dashboard/dashboardChart/RevenueChart";
import GoalsChart from "../../components/dashboard/dashboardChart/GoalsChart";
import TopServices from "../../components/dashboard/dashboardChart/TopServices";
import "../../components/dashboard/style/dashboard.scss";
import { Chart as ChartJS, registerables } from "chart.js";
import SatisfactionChart from "../../components/dashboard/dashboardChart/SatisfactionChart ";
import WorldMap from "../../components/dashboard/dashboardChart/WorldMap";
import VolumeServiceLevel from "../../components/dashboard/dashboardChart/VolumeServiceLevel";
import { useSelector } from "react-redux";
import DataChart from "../../components/dashboard/dashboardChart/DataChart";
import { Spin } from "antd";
import { useEffect, useState } from "react";
import { userSelector } from "../../redux/selectors/selector";
import { getAllBookings } from "../../services/booking.services";
import { getAllTransactions } from "../../services/transaction.services";

ChartJS.register(...registerables);

const Dashboard = () => {
  const userData = useSelector(userSelector);

  const [transactionData, setTransactionData] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      if (userData) {
        setIsLoading(true);
        try {
 

          const responseTransaction = await getAllTransactions();
          const responseBooking = await getAllBookings();
          console.log("transactionData: ", responseTransaction.data)
          setTransactionData(responseTransaction.data)
          setBookingData(responseBooking.data)

        } catch (error) {
          // toast.error("There was an error loading data!");
          // toast.error(error.response?.data?.message || error.message);
          console.error("There was an error loading data!:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchItems();
  }, [userData]);


  return (

    <>
      {isLoading ? (
        <div className="flex justify-center w-full h-screen">
          <Spin spinning={isLoading} />
        </div>
      ) : (

        <>
          {/* <div className="dashboard">
            <div className="today_sales_summary dashboard_boxshadow">
              <TodaySalesSummary />
            </div>
            <div className="visitors_Chart dashboard_boxshadow">
              <VisitorsChart />
            </div>

            <div className="revenue_chart dashboard_boxshadow">
              <RevenueChart />
            </div>
            <div className="satisfaction_chart dashboard_boxshadow">
              <SatisfactionChart />
            </div>
            <div className="goals_chart dashboard_boxshadow">
              <GoalsChart />
            </div>
            <div className="top_services dashboard_boxshadow">
              <TopServices />
            </div>
            <div className="world_map dashboard_boxshadow">
              <WorldMap />
            </div>
            <div className="volume_service_level dashboard_boxshadow">
              <VolumeServiceLevel />
            </div>
          </div> */}

          <div className="data-chart dashboard_boxshadow shadow-md">
            <DataChart
              data={transactionData}
              chartType="bar"
              chartTitle="Doanh Thu"
              dataLabel="Doanh thu (VND)"
              valueKey="totalAmount"
              valueFormatter={(value) => `${value.toLocaleString()} VND`}
              tooltipValueLabel="Doanh thu"
              summaryValueLabel="Tổng doanh thu"
              summaryCountLabel="Tổng giao dịch"
              mainColor="rgba(75, 192, 192, 1)"
              dateField="createdAt"
            />
          </div>

          <div className="data-chart dashboard_boxshadow shadow-md">
            <DataChart
              data={bookingData}
              chartType="line"
              chartTitle="Số Lượng Booking"
              dataLabel="Số lượng booking"
              valueKey="count"
              tooltipValueLabel="Số lượng booking"
              summaryValueLabel="Tổng số booking"
              summaryCountLabel="Tổng số booking"
              mainColor="rgba(54, 162, 235, 1)"
              dateField="createdAt"
              yAxisOptions={{
                ticks: {
                  stepSize: 1,
                  precision: 0
                }
              }}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
