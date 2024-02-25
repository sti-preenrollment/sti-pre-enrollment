"use client";

import { DataTable } from "./data-table";
import { EnrollmentApplication, columns } from "./columns";
import { useEffect, useState } from "react";
import supabase from "utils/supabase";
import { Tables } from "types/supabase-helpers";

type EnrollmentApplicationTableProps = {
  initialEnrollmentApplication: EnrollmentApplication[];
};

function EnrollmentApplicationTable({
  initialEnrollmentApplication,
}: EnrollmentApplicationTableProps) {
  const [enrollmentApplication, setEnrollmentApplication] = useState<
    EnrollmentApplication[]
  >(initialEnrollmentApplication);

  useEffect(() => {
    const channel = supabase
      .channel("real time enrollment application")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "enrollment_application",
        },
        (payload) => {
          const newData = payload.new as Tables<"enrollment_application">;

          if (payload.eventType === "UPDATE") {
            setEnrollmentApplication(
              enrollmentApplication?.map((application) => {
                if (
                  application.enrollment_application_id ===
                  newData.enrollment_application_id
                ) {
                  return { ...application, status: newData.status };
                }

                return application;
              })!
            );
          }

          if (payload.eventType === "INSERT") {
            const getEnrollmentApplication = async () => {
              const { data } = await supabase
                .from("enrollment_application")
                .select(
                  "enrollment_application_id, status, user_infomation(firstname, middlename, lastname, suffix, email)"
                )
                .match({
                  enrollment_application_id: newData.enrollment_application_id,
                })
                .single();

              const transformedData = data as unknown as EnrollmentApplication;

              setEnrollmentApplication([
                { ...transformedData },
                ...enrollmentApplication,
              ]);
            };

            getEnrollmentApplication();
          }

          if (payload.eventType === "DELETE") {
            setEnrollmentApplication(
              enrollmentApplication?.filter((application) => {
                return (
                  application.enrollment_application_id !==
                  payload.old.enrollment_application_id
                );
              })
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enrollmentApplication]);

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">Enrollment Application List</h2>
        <div>
          <DataTable columns={columns} data={enrollmentApplication} />
        </div>
      </div>
    </div>
  );
}
export default EnrollmentApplicationTable;
