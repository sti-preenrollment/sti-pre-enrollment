import BarChart from "./BarChart";
import AuditTrail from "./audit-trail";
import Stats from "./stats";

function Dashboard() {
  return (
    <>
      <Stats />
      <div className="grid grid-cols-4 my-3">
        <BarChart />
        <AuditTrail />
      </div>
    </>
  );
}

export default Dashboard;
