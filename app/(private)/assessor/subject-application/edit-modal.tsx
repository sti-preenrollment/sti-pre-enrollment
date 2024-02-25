"use client";

import { LoadingComponent } from "@components/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Tables } from "types/supabase-helpers";
import supabase from "utils/supabase";
import { SelectInput } from "@components/inputs";
import { FieldValues, useForm } from "react-hook-form";
import SubjectSelectionDataTable from "./subject-selection-data-table";
import { columns } from "./subject-selection-columns";
import { modalAction } from "@helper/modalAction";
import { useCreateQueryString } from "@hooks/useCreateQueryString";
import { useSession } from "next-auth/react";

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

function EditModal() {
  const { data: session } = useSession();
  const router = useRouter();
  const createQueryString = useCreateQueryString();
  const [student, setStudent] = useState<SubjectAssessmentForm | null>(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const edit = searchParams.get("edit");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { register, setValue, handleSubmit } = useForm();
  const [sections, setSections] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<Subject[] | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<Record<
    string,
    boolean
  > | null>(null);

  useEffect(() => {
    if (!id || !edit) {
      setSubjects([]);
      return;
    }
    const abortController = new AbortController();
    (async () => {
      const { data: subjects } = await supabase
        .from("subject")
        .select("*, subject_schedule(*)")
        .abortSignal(abortController.signal);

      setSubjects(subjects);
    })();

    return () => {
      abortController.abort();
    };
  }, [edit, id]);

  useEffect(() => {
    const abortController = new AbortController();
    (async () => {
      const { data: sections } = await supabase
        .from("distinct_sections")
        .select("section")
        .abortSignal(abortController.signal);

      setSections(sections?.map((obj) => obj.section!)!);
      setValue("section", student?.section);
    })();

    return () => {
      abortController.abort();
    };
  }, [setValue, student?.section]);

  useEffect(() => {
    const abortController = new AbortController();

    const getApplications = async () => {
      if (!id || !edit) return;

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

  useEffect(() => {
    if (!student?.subject) {
      setSelectedSubjects(null);
      return;
    }

    setSelectedSubjects(
      student?.subject.reduce((acc, cur) => ({ ...acc, [cur.id]: true }), {})
    );
  }, [student?.subject]);

  const handleExit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    modalAction("edit_modal", "close");
    modalAction("assessment_modal", "open");

    setSelectedSubjects(null);
    setValue("message", "");
    router.push("?" + createQueryString("edit", ""));
  };

  const onSubmit = async (values: FieldValues) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/student/subject-assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          yearLevel: values.yearLevel,
          program: values.program,
          section: values.section,
          subjects: values.subjects,
          userId: student?.subject_assessment_id,
          studentType: values.studentType.toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        console.error(data.error);
        return;
      }

      const auditExist = await supabase
        .from("audit_trail")
        .select()
        .eq("student", id!)
        .single();

      if (auditExist) {
        await supabase.from("audit_trail").delete().eq("student", id!);
      }

      await supabase.from("audit_trail").insert({
        action: "edited",
        message: values.message,
        allow_resubmission: true,
        student: id!,
        performer_id: session?.user.id,
        performer_name: session?.user.name,
      });

      toast.success(data.message);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
      setSelectedSubjects(null);
      setValue("message", "");
      modalAction("edit_modal", "close");
      modalAction("assessment_modal", "open");

      router.push("?" + createQueryString("edit", "edited"));
    }
  };

  return (
    <>
      <dialog id="edit_modal" className="modal p-5">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="modal-box relative w-full max-w-5xl overflow-hidden"
        >
          {!student ? (
            <span>Loading...</span>
          ) : (
            <h3 className="font-bold text-lg">{`${student?.user_infomation.lastname}, ${student?.user_infomation.firstname} ${student?.user_infomation.middlename} ${student?.user_infomation.suffix}`}</h3>
          )}

          <div className="divider divider-primary m-1"></div>
          <div className="max-h-[70svh] relative overflow-y-auto min-h-[20svh] p-3">
            {!student ? (
              <div className="text-center absolute inset-0 grid place-items-center">
                <LoadingComponent size="md" />
              </div>
            ) : (
              <>
                <div className="col-span-3 grid grid-cols-4 gap-2">
                  <SelectInput
                    label="Student Type"
                    name="studentType"
                    defaultValue={`${student.student_status}`}
                    options={["regular", "irregular"]}
                    register={register}
                  />
                  <SelectInput
                    label="Year Level"
                    name="yearLevel"
                    register={register}
                    defaultValue={`${student.year}`}
                    options={[
                      "First Year",
                      "Second Year",
                      "Third Year",
                      "Fourth Year",
                    ]}
                  />
                  <SelectInput
                    label="Program"
                    name="program"
                    register={register}
                    defaultValue={`${student.program}`}
                    options={[
                      "BS Information Technology (BSIT)",
                      "BS Computer Science (BSCS)",
                      "BS Hospitality Management (BSHM)",
                      "BS Tourism Management (BSTM)",
                      "BS Accountancy (BSA)",
                      "BS Business Administration (BSBA)",
                      "BS Accounting Information Systemc(BSAIS)",
                      "Bachelor of Arts in Communication (BACOMM)",
                      "Bachelor of Multimedia Arts (BMMA)",
                      "BS Computer Engineering (BSCpE)",
                      "Associate in Computer Technology (ACT)",
                      "Hospitality and Resturant Service (HRS)",
                    ]}
                  />

                  <SelectInput
                    label="Section"
                    name="section"
                    defaultValue={`${student.section}`}
                    options={sections}
                    register={register}
                  />
                </div>
              </>
            )}
            {!subjects ? (
              <div className="loading loading-dots loading-md text-primary"></div>
            ) : (
              <div>
                {!selectedSubjects ? (
                  <div>Loading</div>
                ) : (
                  <SubjectSelectionDataTable
                    columns={columns}
                    data={subjects}
                    setValue={setValue}
                    initialSelectedSubjecs={selectedSubjects}
                  />
                )}
              </div>
            )}

            <div className="mt-5 space-y-2">
              <h2 className="font-semibold">Reason for edit...</h2>
              <textarea
                className="textarea textarea-bordered focus:outline-primary w-full h-20"
                placeholder="Type here"
                {...register("message", { required: true })}
              ></textarea>
            </div>
          </div>
          {student && (
            <div className="modal-action">
              <>
                <button
                  disabled={isLoading}
                  onClick={handleExit}
                  className="btn btn-error text-white capitalize"
                >
                  cancel
                </button>
                <button
                  disabled={isLoading}
                  className="btn btn-success text-white capitalize"
                >
                  confirm
                </button>
              </>
            </div>
          )}
        </form>
      </dialog>
    </>
  );
}
export default EditModal;
