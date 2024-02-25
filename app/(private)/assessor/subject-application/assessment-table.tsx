"use client";

import { DataTable } from "./data-table";
import { SubjectAssessment, columns } from "./columns";
import { useEffect, useState } from "react";
import supabase from "utils/supabase";
import { Tables } from "types/supabase-helpers";

type SubjectAssessmentTableProps = {
  initialSubjectAssessment: SubjectAssessment[];
};

function SubjectAssessmentTable({
  initialSubjectAssessment,
}: SubjectAssessmentTableProps) {
  const [subjectAssessment, setSubjectAssessment] = useState<
    SubjectAssessment[]
  >(initialSubjectAssessment);

  useEffect(() => {
    const channel = supabase
      .channel("real time enrollment application")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "subject_assessment",
        },
        (payload) => {
          const newData = payload.new as Tables<"subject_assessment">;

          if (payload.eventType === "UPDATE") {
            setSubjectAssessment(
              subjectAssessment?.map((application) => {
                if (
                  application.subject_assessment_id ===
                  newData.subject_assessment_id
                ) {
                  return {
                    ...application,
                    status: newData.status,
                    print_status: newData.print_status,
                  };
                }

                return application;
              })!
            );
          }

          if (payload.eventType === "INSERT") {
            const getSubjectAssessment = async () => {
              const { data } = await supabase
                .from("subject_assessment")
                .select(
                  "subject_assessment_id, status, print_status, user_infomation(firstname, middlename, lastname, suffix, email)"
                )
                .match({
                  subject_assessment_id: newData.subject_assessment_id,
                })
                .single();

              const transformedData = data as unknown as SubjectAssessment;

              setSubjectAssessment([
                { ...transformedData },
                ...subjectAssessment,
              ]);
            };

            getSubjectAssessment();
          }

          if (payload.eventType === "DELETE") {
            setSubjectAssessment(
              subjectAssessment?.filter((application) => {
                return (
                  application.subject_assessment_id !==
                  payload.old.subject_assessment_id
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
  }, [subjectAssessment]);

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">Subject Assessment List</h2>
        <div>
          <DataTable columns={columns} data={subjectAssessment} />
        </div>
      </div>
    </div>
  );
}
export default SubjectAssessmentTable;
