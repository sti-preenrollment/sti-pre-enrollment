"use client";

import { DataTable } from "./data-table";
import { User, columns } from "./columns";
import { useEffect, useState } from "react";
import supabase from "utils/supabase";
import { modalAction } from "@helper/modalAction";

type UserListTableProps = {
  initialUserList: User[];
};

function UserListTable({ initialUserList }: UserListTableProps) {
  const [userList, setUserList] = useState<User[]>(initialUserList);
  const [isClickable, setIsClickable] = useState<boolean>(false);

  useEffect(() => {
    const channel = supabase
      .channel("real time")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user",
        },
        (payload) => {
          const newData = payload.new as User;

          if (payload.eventType === "INSERT") {
            setUserList([...userList, newData]);
          }

          if (payload.eventType === "UPDATE") {
            setUserList(
              userList.map((user) => {
                if (user.id === newData.id) {
                  return {
                    ...user,
                    role: newData.role,
                    email: newData.email,
                    name: newData.email,
                  };
                }

                return user;
              })
            );
          }

          if (payload.eventType === "DELETE") {
            setUserList(userList.filter((user) => user.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userList]);

  const handleTruncate = async () => {
    modalAction("truncate_modal", "open");
  };

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">Account Management</h2>
        <div>
          <DataTable columns={columns} data={userList} />
        </div>
        <div className="card-actions items-center">
          <button
            disabled={!isClickable}
            onClick={handleTruncate}
            className="btn btn-accent btn-sm text-white"
          >
            Truncate Student Data
          </button>
          <div className="flex gap-3">
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={isClickable}
              onChange={() => setIsClickable((prev) => !prev)}
            />
            <span>Trancate?</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default UserListTable;
