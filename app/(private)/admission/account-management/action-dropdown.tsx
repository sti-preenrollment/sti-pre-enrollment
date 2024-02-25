"use client";

import { EllipsisVertical, PencilSquare, Trash } from "@assets/icons";
import { modalAction } from "@helper/modalAction";
import { useCreateQueryString } from "@hooks/useCreateQueryString";
import { useRouter } from "next/navigation";

function ActioniDropdown({
  userId,
  userRole,
}: {
  userId: string;
  userRole: "student" | "admission" | "assessor";
}) {
  const createQueryString = useCreateQueryString();
  const router = useRouter();

  const addUseIdQuery = () => {
    router.push("?" + createQueryString("id", userId));
  };

  const handleDeleteUser = () => {
    addUseIdQuery();
    modalAction("delete_modal", "open");
  };

  const handleEditUser = () => {
    addUseIdQuery();
    modalAction("edit_modal", "open");
  };
  return (
    <div className="dropdown dropdown-bottom dropdown-end">
      <label tabIndex={0} className="btn btn-ghost">
        <EllipsisVertical className="w-4" />
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow border bg-base-100 rounded-box w-52"
      >
        <li>
          <button onClick={handleEditUser}>
            <PencilSquare className="w-4 text-success" /> Edit User
          </button>
        </li>

        {userRole === "student" && (
          <li>
            <button onClick={handleDeleteUser}>
              <Trash className="w-4 text-error" /> Delete User
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}
export default ActioniDropdown;
