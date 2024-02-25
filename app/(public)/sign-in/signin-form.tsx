"use client";

import { TextInput } from "@components/inputs";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const signInFormSchema = z.object({
  email: z.string().min(1, "This field is required").email(),
  password: z.string().min(1, "This field is required"),
});

type SignInFormType = z.infer<typeof signInFormSchema>;

export default function SignInForm() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormType>({
    resolver: zodResolver(signInFormSchema),
  });

  const showPassword = () => {
    setIsVisible((prev) => !prev);
  };

  const onSubmit = async (values: SignInFormType) => {
    try {
      const signInData = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (signInData?.error) {
        toast.error("Login error: Wrong email or password");
      } else {
        router.refresh();
        router.push("/sign-in/redirect");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="card w-full max-w-md flex-shrink-0 border-t-4 border-primary bg-base-100 shadow-xl">
      <div className="card-body">
        <h1 className="card-title inline-block text-center text-2xl  text-neutral-600 ">
          Sign in to you account
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label="Email"
            name="email"
            placeholder="Email"
            register={register}
            error={errors.email?.message}
          />
          <TextInput
            type={isVisible ? "text" : "password"}
            label="Password"
            name="password"
            placeholder="Password"
            register={register}
            error={errors.password?.message}
          />
          <label className="ml-2">
            <input
              type="checkbox"
              checked={isVisible}
              onChange={showPassword}
            />
            <span className="ml-2 text-neutral-500">Show password</span>
          </label>
          <div className="form-control mt-6">
            <button disabled={isSubmitting} className="btn btn-primary">
              Login
            </button>
          </div>
        </form>
        <p className="label-text text-center ">
          No account yet?{" "}
          <Link href={"/enroll"} className="text-primary underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
