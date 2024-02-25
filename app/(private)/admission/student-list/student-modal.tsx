"use client";

import { DisabledTextInput, LoadingComponent } from "@components/ui";
import { useCreateQueryString } from "@hooks/useCreateQueryString";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Tables } from "types/supabase-helpers";
import supabase from "utils/supabase";

function StudentModal() {
  const router = useRouter();
  const createQueryString = useCreateQueryString();
  const [student, setStudent] = useState<Tables<"user_infomation"> | null>(
    null
  );
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const getApplications = async () => {
      if (!id) return;

      try {
        const { data: student } = await supabase
          .from("user_infomation")
          .select()
          .eq("user_id", id)
          .single();

        setStudent(student);
      } catch (error: any) {
        console.error(error);
      }
    };

    getApplications();
  }, [id]);

  const handleExit = () => {
    router.push("?" + createQueryString("id", ""));
    setStudent(null);
  };

  return (
    <dialog id="student_list_modal" className="modal p-5">
      <div className="modal-box w-full max-w-xl">
        <h3 className="font-bold text-lg">Student Information</h3>
        <div className="divider m-1"></div>
        <div className="relative overflow-y-auto">
          {!student ? (
            <div className="text-center grid place-items-center">
              <LoadingComponent size="md" />
            </div>
          ) : (
            <div className="grid-cols-2 gap-x-2  md:grid">
              <DisabledTextInput
                label="First Name"
                value={`${student.firstname}`}
              />
              <DisabledTextInput
                label="Middle Name"
                value={`${student.middlename}`}
              />
              <DisabledTextInput
                label="Last Name"
                value={`${student.lastname}`}
              />
              <DisabledTextInput label="Suffix" value={`${student.suffix}`} />
              <DisabledTextInput label="Email" value={`${student.email}`} />
              <DisabledTextInput
                label="Contact Number"
                value={`${student.contact}`}
              />
              {student.last_school && (
                <DisabledTextInput
                  label="Last School"
                  value={`${student.last_school}`}
                />
              )}

              {student.student_number && (
                <DisabledTextInput
                  label="Student Number"
                  value={`${student.student_number}`}
                />
              )}
            </div>
          )}
        </div>
        <form method="dialog" className="justify-end flex mt-4">
          <button
            onClick={handleExit}
            className="btn px-5 text-white btn-accent p-2"
          >
            Close
          </button>
        </form>
      </div>
    </dialog>
  );
}
export default StudentModal;
