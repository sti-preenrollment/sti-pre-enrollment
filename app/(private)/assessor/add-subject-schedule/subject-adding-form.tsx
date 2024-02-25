"use client";

import { SelectInput, TextInput } from "@components/inputs";
import TimeInput from "@components/inputs/time-input";
import SubmitButton from "@components/ui/submit-button";
import { modalAction } from "@helper/modalAction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const subjectAddFormSchema = z.object({
  subject_code: z.string().min(1, "This field is required"),
  subject_name: z.string().min(1, "This field is required"),
  year_level: z.string().min(1, "This field is required"),
  instructor: z.string().nullable(),
  units: z.string().min(1, "This field is required"),
  program: z.string().min(1, "This field is required"),
  section: z.string().min(1, "This field is required"),
  subject_schedule: z.array(
    z.object({
      day: z.string().min(1, "This field is required"),
      room: z.string().min(1, "This field is required"),
      start: z.string().min(1, "This field is required"),
      end: z.string().min(1, "This field is required"),
    })
  ),
});

type SubjectAddFormType = z.infer<typeof subjectAddFormSchema>;

function generateSections(): string[] {
  let arr: string[] = [];
  for (let i = 101; i < 104; i++) arr.push(`Room ${i}`);
  for (let i = 201; i < 214; i++) arr.push(`Room ${i}`);
  for (let i = 301; i < 312; i++) arr.push(`Room ${i}`);

  return [...arr, "Conference", "Gym", "Mezzanine"];
}

const sections: string[] = generateSections();

function SubjectAddForm() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<SubjectAddFormType>({
    resolver: zodResolver(subjectAddFormSchema),
    defaultValues: {
      subject_code: "",
      subject_name: "",
      instructor: "",
      year_level: "",
      units: "",
      program: "",
      section: "",
      subject_schedule: [{ day: "", end: "", room: "", start: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "subject_schedule",
  });

  const onSubmit = async (values: SubjectAddFormType) => {
    values.subject_schedule.forEach((sched) => {
      sched.start = convertTo12Hour(sched.start);
      sched.end = convertTo12Hour(sched.end);
    });
    try {
      const response = await fetch("/api/assessor/add-subject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error("Adding failed. Try again.");
        console.log(data.message);
        return;
      }

      toast.success(data.message);
    } catch (error) {
      toast.error("Something went wrong.");
      console.error(error);
    } finally {
      modalAction("upload_modal", "close");
      reset();
    }
  };

  const handleUpload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    modalAction("upload_modal", "open");
  };

  function convertTo12Hour(time: string) {
    const [hour, minute] = time.split(":");
    let h = parseInt(hour);
    const period = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12; // convert 0 to 12 for 12-hour format
    return `${h.toString().padStart(2, "0")}:${minute} ${period}`;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card bg-base-100 shadow-lg"
    >
      <div className="card-body">
        <h2 className="card-title">Add Subject Schedule</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2">
          <TextInput
            label="Code"
            name="subject_code"
            placeholder="Code"
            register={register}
            error={errors.subject_code?.message}
          />
          <TextInput
            label="Name"
            name="subject_name"
            placeholder="Name"
            register={register}
            error={errors.subject_name?.message}
          />
          <TextInput
            label="Instructor"
            name="instructor"
            placeholder="Instructor"
            register={register}
            error={errors.instructor?.message}
          />
          <SelectInput
            label="Year"
            name="year_level"
            options={["First Year", "Second Year", "Third Year", "Fourth Year"]}
            register={register}
            error={errors.year_level?.message}
          />
          <SelectInput
            label="Program"
            name="program"
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
            register={register}
            error={errors.program?.message}
          />
          <TextInput
            label="Section"
            name="section"
            placeholder="Section"
            register={register}
            error={errors.section?.message}
          />
          <TextInput
            label="Units"
            name="units"
            placeholder="Units"
            register={register}
            error={errors.section?.message}
          />
        </div>

        <div className="flex flex-col py-3 ">
          <label className="font-semibold text-sm p-[2px]">Schedule</label>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="md:grid md:grid-cols-5 gap-3 items-center text-center bg-slate-50 p-3"
            >
              <TimeInput
                label="Start"
                name={`subject_schedule.${index}.start`}
                placeholder="Start"
                register={register}
                error={errors.subject_schedule?.message}
              />
              <TimeInput
                label="End"
                name={`subject_schedule.${index}.end`}
                placeholder="End"
                register={register}
                error={errors.subject_schedule?.message}
              />
              <SelectInput
                label="Day"
                name={`subject_schedule.${index}.day`}
                options={[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ]}
                register={register}
                error={errors.subject_schedule?.message}
              />
              <SelectInput
                label="Room"
                name={`subject_schedule.${index}.room`}
                options={sections}
                register={register}
                error={errors.subject_schedule?.message}
              />
              {index > 0 && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    remove(index);
                  }}
                  className="btn btn-error text-white "
                >
                  delete
                </button>
              )}
              <div className="divider my-1 col-span-5"></div>
            </div>
          ))}
          <button
            onClick={(e) => {
              e.preventDefault();
              append({ day: "", end: "", room: "", start: "" });
            }}
            className="btn btn-success text-white text-2xl max-w-[4rem] m-2"
          >
            +
          </button>
        </div>
        <div className="card-actions justify-end">
          <button
            disabled={isSubmitting}
            onClick={handleUpload}
            className="btn btn-info text-white"
          >
            Upload Schedule
          </button>
          <SubmitButton isSubmitting={isSubmitting} />
        </div>
      </div>
    </form>
  );
}
export default SubjectAddForm;
