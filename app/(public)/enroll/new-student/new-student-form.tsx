"use client";

import { ContactNumberInput, TextInput } from "@components/inputs";
import SubmitButton from "@components/ui/submit-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const newStudentFormSchema = z.object({
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
      return [
        "gmail.com",
        "outlook.com",
        "icloud.com",
        "yahoo.com",
        "protonmail.com",
      ].includes(domain);
    }, "Please enter a valid email from Gmail, Outlook, iCloud, Yahoo, or ProtonMail"),
  contact: z
    .string()
    .min(1, "This field is required")
    .length(13, "Invalid contact number"),
  lastSchool: z.string().min(1, "This field is required"),
});

type NewStudentFromType = z.infer<typeof newStudentFormSchema>;

export default function NewStudentForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<NewStudentFromType>({
    resolver: zodResolver(newStudentFormSchema),
  });

  const onSubmit = async (values: NewStudentFromType) => {
    try {
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          studentType: "new_student",
          studentNo: null,
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
              error={errors.firstName?.message}
              required
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
              error={errors.lastName?.message}
              required
            />
            <TextInput
              label="Suffix"
              placeholder="(e.g. Jr.)"
              name="suffix"
              register={register}
              error={errors.suffix?.message}
            />
            <TextInput
              label="Email"
              placeholder="Email"
              name="email"
              register={register}
              error={errors.email?.message}
              required
            />
            <ContactNumberInput
              label="Contact Number"
              control={control}
              name="contact"
              placeholder="987 654 3210"
              error={errors.contact?.message}
              required
            />
            <TextInput
              className="col-span-2"
              label="Last School Attended"
              placeholder="Last School Attended"
              name="lastSchool"
              register={register}
              error={errors.lastSchool?.message}
              required
            />
          </div>

          <div className="card-actions mt-3 flex flex-col items-end">
            <SubmitButton isSubmitting={isSubmitting} />
          </div>
        </form>
      </div>
    </div>
  );
}
