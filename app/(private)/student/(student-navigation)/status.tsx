import classNames from "classnames";

function Status({ status }: { status: string }) {
  return (
    <div className="card bg-base-100 shadow-lg mb-3">
      <div className="card-body">
        <div className="flex justify-between">
          <span className="font-semibold">Request Status</span>
          <span
            className={classNames("capitalize font-semibold", {
              "text-warning": status === "pending",
              "text-success": status === "approved",
              "text-error": status === "rejected",
            })}
          >
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}
export default Status;
