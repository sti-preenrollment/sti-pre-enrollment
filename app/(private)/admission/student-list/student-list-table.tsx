"use client";

import { DataTable } from "./data-table";
import { Student, columns } from "./columns";
import { useEffect, useState } from "react";
import supabase from "utils/supabase";

type StudentListTableProps = {
  initialstudentList: Student[];
};

function StudentListTable({ initialstudentList }: StudentListTableProps) {
  const [studentList, setStudentList] = useState<Student[]>(initialstudentList);

  useEffect(() => {
    const channel = supabase
      .channel("real time")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_infomation",
        },
        (payload) => {
          setStudentList([...studentList, payload.new as Student]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [studentList]);

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">Student List</h2>
        <div>
          <DataTable columns={columns} data={studentList} />
        </div>
      </div>
    </div>
  );
}
export default StudentListTable;
