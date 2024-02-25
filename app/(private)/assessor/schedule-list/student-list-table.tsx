"use client";

import { useEffect, useState } from "react";
import { Tables } from "types/supabase-helpers";
import { columns } from "./column";
import { DataTable } from "./data-table";
import supabase from "utils/supabase";
import { modalAction } from "@helper/modalAction";

function StudentListTable({
  initialSubjectList,
}: {
  initialSubjectList: Tables<"subject">[];
}) {
  const [subjectList, setSubjectList] =
    useState<Tables<"subject">[]>(initialSubjectList);
  const [isClickable, setIsClickable] = useState<boolean>(false);

  useEffect(() => {
    const channel = supabase
      .channel("real time")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "subject",
        },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setSubjectList(
              subjectList.filter((subject) => subject.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [subjectList]);

  const handleTruncate = () => {
    modalAction("truncate_modal", "open");
  };

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">Subject List</h2>
        <div>
          <DataTable columns={columns} data={subjectList} />
        </div>
        <div className="card-actions items-center">
          <button
            disabled={!isClickable}
            onClick={handleTruncate}
            className="btn btn-accent btn-sm text-white"
          >
            Truncate Subject Data
          </button>
          <div className="flex gap-3">
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={isClickable}
              onChange={() => setIsClickable((prev) => !prev)}
            />
            <span>Truncate?</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default StudentListTable;
