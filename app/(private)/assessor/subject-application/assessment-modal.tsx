"use client";

import { XMark } from "@assets/icons";
import { DisabledTextInput, LoadingComponent } from "@components/ui";
import { useCreateQueryString } from "@hooks/useCreateQueryString";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Tables } from "types/supabase-helpers";
import supabase from "utils/supabase";
import { modalAction } from "@helper/modalAction";

type UserInfo = Pick<
  Tables<"user_infomation">,
  | "firstname"
  | "middlename"
  | "lastname"
  | "suffix"
  | "student_number"
  | "email"
>;
type SubjectAssessment = Tables<"subject_assessment">;
type Subject = Tables<"subject"> & {
  subject_schedule: Schedule[];
};
type Schedule = Tables<"subject_schedule">;

type SubjectAssessmentForm = SubjectAssessment & {
  user_infomation: UserInfo;
  subject: Subject[];
};

function SubjectAssessmentModal() {
  const { data: session } = useSession();
  const router = useRouter();
  const createQueryString = useCreateQueryString();
  const [student, setStudent] = useState<SubjectAssessmentForm | null>(null);
  const [audit, setAudit] = useState<Tables<"audit_trail"> | null>(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const edit = searchParams.get("edit");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePrint = () => {
    modalAction("print_modal", "open");
    modalAction("assessment_modal", "close");

    router.push("?" + createQueryString("edit", "print"));
  };

  useEffect(() => {
    const abortController = new AbortController();

    const getApplications = async () => {
      if (!id) return;

      try {
        const response = await fetch(
          `/api/student/subject-assessment?id=${id}`,
          { signal: abortController.signal }
        );
        const data = await response.json();

        if (!response.ok) {
          toast.error(data.message);
          console.error(data.error);
          return;
        }

        setStudent(data);

        const { data: audit } = await supabase
          .from("audit_trail")
          .select()
          .eq("student", id)
          .single();

        setAudit(audit);
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          toast.error("Something went wrong.");
        }
      }
    };

    getApplications();

    return () => {
      abortController.abort();
    };
  }, [id, edit]);

  const handleExit = () => {
    router.push("?" + createQueryString("id", ""));
    setStudent(null);
    setAudit(null);
  };

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("subject_assessment")
        .update({
          status: "approved",
          print_status: !audit ? "for printing" : "pending",
        })
        .eq("subject_assessment_id", id!);

      if (error) {
        toast.error("Action failed");
        console.error(error);
        return;
      }

      await supabase.from("audit_trail").insert({
        action: "approved",
        student: id!,
        performer_id: session?.user.id,
        performer_name: session?.user.name,
      });

      toast.success("Application approved");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setStudent({ ...student!, status: "approved" });
      router.push("?" + createQueryString("edit", ""));
    }
  };

  const handleReject = () => {
    modalAction("reject_modal", "open");
  };

  const handleEdit = () => {
    modalAction("edit_modal", "open");
    modalAction("assessment_modal", "close");

    router.push(
      "?" + createQueryString("edit", student?.subject_assessment_id!)
    );
  };

  const handlePrinted = async () => {
    setIsLoading(true);
    try {
      const { error: printStatusError } = await supabase
        .from("subject_assessment")
        .update({ print_status: "printed" })
        .eq("subject_assessment_id", id!);

      if (printStatusError) {
        toast.error("Something went wrong.");
        console.error(printStatusError.message);
        return;
      }

      toast.success("Assessment marked as printed.");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setStudent(null);
      router.push("?" + createQueryString("id", ""));
      modalAction("assessment_modal", "close");
    }
  };

  return (
    <>
      <dialog id="assessment_modal" className="modal p-5">
        <div className="modal-box relative w-full max-w-3xl overflow-hidden">
          <form method="dialog" className="absolute right-5">
            <button className="btn btn-sm btn-accent p-2" onClick={handleExit}>
              <XMark className="h-4 w-4 text-white" />
            </button>
          </form>

          <h3 className="font-bold text-lg">Subject Assessment</h3>
          <div className="divider divider-primary m-1"></div>
          <div className="max-h-[70svh] relative overflow-y-auto min-h-[20svh] ">
            {!student ? (
              <div className="text-center absolute inset-0 grid place-items-center">
                <LoadingComponent size="md" />
              </div>
            ) : (
              <>
                <div className="sm:grid md:grid-cols-3 sm:grid-cols-2 gap-2">
                  <DisabledTextInput
                    label="Name"
                    value={`${student.user_infomation.lastname}, ${
                      student.user_infomation.firstname
                    } ${student.user_infomation.middlename?.charAt(0)}. ${
                      student.user_infomation.suffix
                    }`}
                  />
                  <DisabledTextInput
                    label="Email"
                    value={student.user_infomation.email}
                  />
                  <DisabledTextInput
                    label="Student Number"
                    value={student.user_infomation.student_number || ""}
                  />

                  <DisabledTextInput label="Year" value={student.year!} />
                  <DisabledTextInput label="Pogram" value={student.program!} />
                  <DisabledTextInput label="Section" value={student.section!} />
                </div>
                <div className="mt-5">
                  <div className="overflow-x-auto">
                    <table className="table table-zebra">
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Subject Name</th>
                          <th>Instructor</th>
                          <th>Section</th>
                          <th>Year</th>
                        </tr>
                      </thead>
                      <tbody>
                        {student.subject.map((subject) => (
                          <tr key={subject.id}>
                            <td>{subject.subject_code}</td>
                            <td>{subject.subject_name}</td>
                            <td>{subject.instructor}</td>
                            <td>{subject.section}</td>
                            <td>{subject.year_level}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
          {student && (
            <div className="modal-action">
              {student?.status === "pending" && (
                <>
                  <button
                    onClick={handleEdit}
                    disabled={isLoading}
                    className="btn btn-warning text-white capitalize"
                  >
                    edit
                  </button>
                  <button
                    disabled={isLoading}
                    onClick={handleReject}
                    className="btn btn-error text-white capitalize"
                  >
                    reject
                  </button>
                  <button
                    disabled={isLoading}
                    onClick={handleApprove}
                    className="btn btn-success text-white capitalize"
                  >
                    approve
                  </button>
                </>
              )}
              {student.print_status === "printed" && (
                <button
                  disabled={isLoading}
                  onClick={handlePrint}
                  className="btn btn-info text-white"
                >
                  Show Pre-Assessment Form
                </button>
              )}
              {student.print_status === "for printing" && (
                <>
                  <button
                    disabled={isLoading}
                    onClick={handlePrint}
                    className="btn btn-info text-white"
                  >
                    Show Pre-Assessment Form
                  </button>
                  <button
                    disabled={isLoading}
                    onClick={handlePrinted}
                    className="btn bg-sky-900 hover:bg-sky-950 text-white"
                  >
                    Printed
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
export default SubjectAssessmentModal;
