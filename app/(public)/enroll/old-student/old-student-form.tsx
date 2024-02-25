"use client";

import { ContactNumberInput, TextInput } from "@components/inputs";
import SubmitButton from "@components/ui/submit-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const oldStudentFormSchema = z.object({
  firstName: z.string().min(1, "This field is required"),
  middleName: z.string(),
  lastName: z.string().min(1, "This field is required"),
  suffix: z.string().max(3),
  email: z
    .string()
    .min(1, "This field is required")
    .email("Please enter a valid email")
    .refine((email) => {
      const domain = email.split("@")[1];
      return ["calamba.sti.edu.ph"].includes(domain);
    }, "Kindly utilize your STI 365 email for this purpose."),
  contact: z
    .string()
    .min(1, "This field is required")
    .length(13, "Invalid contact number"),
  studentNo: z.string().min(1, "This field is required"),
});

type OldStudentFormType = z.infer<typeof oldStudentFormSchema>;

export default function OldStudentForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<OldStudentFormType>({
    resolver: zodResolver(oldStudentFormSchema),
  });

  const onSubmit = async (values: OldStudentFormType) => {
    try {
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          studentType: "old_student",
          lastSchool: null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        console.error(data.error);
        return;
      }

      router.push(`/enroll/otp-verification/${data.newUserRegistration.id}`);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Try again");
    }
  };

  return (
    <div className="card flex w-full max-w-xl border-t-4 border-primary bg-base-100 shadow-xl">
      <div className="card-body">
        <h1 className="card-title inline-block text-center text-2xl">
          Please provide the necessary information.
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid-cols-2 gap-x-3 md:grid">
            <TextInput
              label="First Name"
              placeholder="Given Name"
              name="firstName"
              register={register}
              required
              error={errors.firstName?.message}
            />
            <TextInput
              label="Middle Name"
              placeholder="Middle Name"
              name="middleName"
              register={register}
              error={errors.middleName?.message}
            />
            <TextInput
              label="Last Name"
              placeholder="Last Name"
              name="lastName"
              register={register}
              required
              error={errors.lastName?.message}
            />
            <TextInput
              label="Suffix"
              placeholder="Suffix"
              name="suffix"
              register={register}
              error={errors.suffix?.message}
            />
            <TextInput
              className="col-span-2"
              label="Email"
              placeholder="Email"
              name="email"
              register={register}
              required
              error={errors.email?.message}
            />
            <TextInput
              label="Student Number"
              placeholder="Student Number"
              name="studentNo"
              register={register}
              required
              error={errors.studentNo?.message}
            />
            <ContactNumberInput
              label="Contact Number"
              control={control}
              name="contact"
              placeholder="987 654 3210"
              required
              error={errors.contact?.message}
            />
          </div>

          <div className="card-actions mt-3 justify-end">
            <SubmitButton isSubmitting={isSubmitting} />
          </div>
        </form>
      </div>
    </div>
  );
}
