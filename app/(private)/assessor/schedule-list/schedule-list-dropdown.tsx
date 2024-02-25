import { EllipsisVertical, Eye, Trash } from "@assets/icons";
import { modalAction } from "@helper/modalAction";
import { useCreateQueryString } from "@hooks/useCreateQueryString";
import { useRouter } from "next/navigation";

function SheduleListDropdown({ subjectId }: { subjectId: string }) {
  const createQueryString = useCreateQueryString();
  const router = useRouter();

  const addUseIdQuery = () => {
    router.push("?" + createQueryString("id", subjectId));
  };

  const handleDeleteSubject = () => {
    addUseIdQuery();
    modalAction("delete_modal", "open");
  };

  const handleViewSchedule = () => {
    addUseIdQuery();
    modalAction("schedule_modal", "open");
  };

  return (
    <div className="dropdown dropdown-left">
      <label tabIndex={0} className="btn btn-ghost m-1">
        <EllipsisVertical className="w-4" />
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content border z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li>
          <button onClick={handleViewSchedule}>
            <Eye className="w-4 text-success" /> View Schedule
          </button>
        </li>
        <li>
          <button onClick={handleDeleteSubject}>
            <Trash className="w-4 text-error" />
            Delete
          </button>
        </li>
      </ul>
    </div>
  );
}
export default SheduleListDropdown;
