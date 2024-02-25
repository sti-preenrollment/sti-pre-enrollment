"use client";

import { TextInput } from "@components/inputs";
import SubmitButton from "@components/ui/submit-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import z from "zod";

const passwordFormSchema = z
  .object({
    password: z.string().min(8, "Your password should be 8 characters long"),
    matchingPassword: z.string(),
  })
  .refine((data) => data.password === data.matchingPassword, {
    message: "Passwords do not match",
    path: ["matchingPassword"],
  });

type PasswordFormType = z.infer<typeof passwordFormSchema>;

export default function PasswordSetupForm() {
  const params = useParams();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormType>({
    resolver: zodResolver(passwordFormSchema),
  });

  const showPassword = () => {
    setIsVisible((prev) => !prev);
  };

  const onSubmit = async (values: PasswordFormType) => {
    try {
      const response = await fetch("/api/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: values.password,
          userId: params.userId as string,
        }),
      });

      if (!response.ok) {
        console.error((await response.json()).message);
        toast.error("Password setup failed. Try again.");
        return;
      }

      toast.success("The password change was successful.");
      router.replace("/sign-in");
    } catch (error) {
      toast.error("Something went wrong. Try again");
    }
  };

  return (
    <div className="card border-t-4 border-primary max-w-md bg-base-100 shadow-md">
      <div className="card-body">
        <h2 className="card-title block text-center">Password Setup</h2>
        <p>Please enter password to secure your account.</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            type={isVisible ? "text" : "password"}
            label="Password"
            placeholder="Enter password"
            name="password"
            register={register}
            error={errors.password?.message}
          />
          <TextInput
            type={isVisible ? "text" : "password"}
            label="Retype Password"
            placeholder="Match the password"
            name="matchingPassword"
            register={register}
            error={errors.matchingPassword?.message}
          />
          <label>
            <input
              type="checkbox"
              checked={isVisible}
              onChange={showPassword}
              className="ml-2"
            />{" "}
            <span className="text-neutral-500">Show password</span>
          </label>
          <div className="card-actions mt-3 justify-end">
            <SubmitButton isSubmitting={isSubmitting} />
          </div>
        </form>
      </div>
    </div>
  );
}
