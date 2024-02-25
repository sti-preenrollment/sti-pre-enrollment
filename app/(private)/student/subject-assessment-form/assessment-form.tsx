"use client";

import { SelectInput } from "@components/inputs";
import { useForm } from "react-hook-form";
import { type Subject, columns } from "./column";
import { type ChangeEvent, useEffect, useState } from "react";
import supabase from "utils/supabase";
import SubjectSelectionDataTable from "./subject-selection-data-table";
import SubmitButton from "@components/ui/submit-button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useSections from "@hooks/useSectionst";

const SubjectSchedule = z.object({
  id: z.string(),
  created_at: z.string(),
  start: z.string(),
  end: z.string(),
  day: z.string(),
  room: z.string(),
  subject_id: z.string(),
});

const Subject = z.object({
  id: z.string(),
  created_at: z.string(),
  subject_name: z.string(),
  subject_code: z.string(),
  instructor: z.string().nullable(),
  year_level: z.string(),
  section: z.string(),
  program: z.string(),
  subject_schedule: z.array(SubjectSchedule),
});

const subjectAssessmentSchema = z.object({
  studentType: z.string().min(1, "This selection field is required"),
  yearLevel: z.string().min(1, "This selection field is required"),
  program: z.string().min(1, "This selection field is required"),
  section: z.string().min(1, "This selection field is required"),
  subjects: z
    .array(Subject)
    .min(1, "You need to select atleast 1 from subject schedules."),
});

type SubjectAssessmentType = {
  studentType: string;
  yearLevel: string;
  program: string;
  section: string;
  subjects: Subject[];
};

type QueryType = {
  studentType: string | null;
  yearLevel: string | null;
  program: string | null;
  section: string | null;
};

function AssessmentForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [type, setType] = useState<"Regular" | "Irregular">();
  const [subjects, setSubjects] = useState<Subject[] | null>(null);
  const [query, setQuery] = useState<QueryType>({
    studentType: null,
    yearLevel: null,
    program: null,
    section: null,
  });

  const sections = useSections({
    program: query.program,
    yearLevel: query.yearLevel,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SubjectAssessmentType>({
    resolver: zodResolver(subjectAssessmentSchema),
  });

  useEffect(() => {
    const abortController = new AbortController();

    const getSubjects = async () => {
      if (
        !query.program ||
        !query.section ||
        !query.studentType ||
        !query.yearLevel
      )
        return;

      let matchParameter = {};
      if (query.studentType === "Regular") {
        matchParameter = {
          program: query.program,
          section: query.section,
          year_level: query.yearLevel,
        };
        setType("Regular");
      } else {
        matchParameter = {};
        setType("Irregular");
      }
      const { data: subjects } = await supabase
        .from("subject")
        .select("*, subject_schedule(*)")
        .match(matchParameter)
        .abortSignal(abortController.signal);

      setSubjects(subjects);
    };

    getSubjects();

    return () => {
      abortController.abort();
    };
  }, [query.program, query.section, query.studentType, query.yearLevel]);

  const handleQuery = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuery({ ...query, [name]: value });
  };

  const onSubmit = async (values: SubjectAssessmentType) => {
    try {
      const response = await fetch("/api/student/subject-assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          userId,
          studentType: values.studentType.toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        console.error(data.error);
        return;
      }

      toast.success(data.message);
      router.replace("/student");
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="card bg-base-100 shadow-lg max-w-3xl mx-auto">
        <div className="card-body">
          <h2 className="card-title divider whitespace-break-spaces text-center sm:whitespace-nowrap text-lg mb-10 sm:mb-0">
            Subject Assessment Form
          </h2>

          <div className="md:grid grid-cols-2 gap-x-2">
            <SelectInput
              onChange={handleQuery}
              label="Student Type"
              name="studentType"
              register={register}
              options={["Regular", "Irregular"]}
              error={errors.studentType?.message}
            />
            <SelectInput
              onChange={handleQuery}
              label="Year Level"
              name="yearLevel"
              register={register}
              options={[
                "First Year",
                "Second Year",
                "Third Year",
                "Fourth Year",
              ]}
              error={errors.yearLevel?.message}
            />
            <SelectInput
              onChange={handleQuery}
              label="Program"
              name="program"
              register={register}
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
              error={errors.program?.message}
            />
            <SelectInput
              onChange={handleQuery}
              label="Section"
              name="section"
              register={register}
              options={sections}
              error={errors.section?.message}
            />
          </div>
        </div>
      </div>
      {!subjects ? (
        <div className="flex justify-center"></div>
      ) : (
        <div className="card bg-base-100 shadow-lg max-w-3xl mx-auto">
          <div className="card-body">
            <h2 className="font-semibold text-sm ml-1 card-title divider">
              Subjects
            </h2>
            <p className="text-sm ml-1 text-neutral-400 ">
              Please select your subjects from the list
            </p>
            <p className="text-sm ml-1 text-neutral-400">
              - <strong>Regular</strong> students don{"'"}t need to make any
              changes. In case a subject has not been selected, please make sure
              to select it.
            </p>
            <p className="text-sm ml-1 text-neutral-400 mb-2">
              - <strong>Irregular</strong> students can select subjects
              according to their preference.
            </p>

            {type === "Regular" && (
              <SubjectSelectionDataTable
                columns={columns}
                data={subjects}
                setValue={setValue}
                isRegular
              />
            )}
            {type === "Irregular" && (
              <SubjectSelectionDataTable
                columns={columns}
                data={subjects}
                setValue={setValue}
              />
            )}

            <p className="text-sm ml-1 text-neutral-400 mb-2">
              <strong>Note:</strong> The presence of a disabled checkbox
              indicates that the subject in question has overlapping schedules
              with another subject during the same time slot.
            </p>

            {errors.subjects && (
              <p className="text-center text-accent">
                {errors.subjects?.message}
              </p>
            )}

            <div className="card-actions justify-end">
              <SubmitButton isSubmitting={isSubmitting} />
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
export default AssessmentForm;
