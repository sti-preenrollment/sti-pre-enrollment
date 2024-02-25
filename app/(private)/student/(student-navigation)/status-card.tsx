import classNames from "classnames";

function StatusCard({ status }: { status: string }) {
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <div className="flex justify-between">
          <span className="capitalize font-semibold">application status</span>
          <span
            className={classNames("capitalize font-bold", {
              "text-yellow-500": status === "PENDING",
              "text-green-500": status === "APPROVED",
              "text-red-500": status === "REJECTED",
            })}
          >
            {status.toLowerCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
export default StatusCard;
