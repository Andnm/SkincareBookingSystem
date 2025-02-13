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

ChartJS.register(...registerables);

const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* <div className="grid grid-flow-col grid-rows-2 grid-cols-3 gap-8"> */}
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
    </div>
  );
};

export default Dashboard;
