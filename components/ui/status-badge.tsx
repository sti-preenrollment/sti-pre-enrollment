import classNames from "classnames";

function StatusBadge({
  status,
}: {
  status: "rejected" | "approved" | "pending" | "for printing" | "printed";
}) {
  return (
    <div
      className={classNames("badge p-3 text-white capitalize", {
        "bg-red-500": status === "rejected",
        "bg-green-500": status === "approved",
        "bg-yellow-500": status === "pending",
        "bg-info": status === "for printing",
        "bg-sky-900": status === "printed",
      })}
    >
      {status}
    </div>
  );
}
export default StatusBadge;
