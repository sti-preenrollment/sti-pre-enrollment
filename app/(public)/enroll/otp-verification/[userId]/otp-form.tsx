"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { OtpInputRef } from "./otp-input-ref";
import ResendButton from "./resend-button";
import z from "zod";
import SubmitButton from "@components/ui/submit-button";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Tables } from "types/supabase-helpers";

const otpInputSchema = z.object({
  otp: z.string().min(1, "This field is required"),
});

type OtpInputType = z.infer<typeof otpInputSchema>;

export default function OtpForm({
  registationRecord,
}: {
  registationRecord: Tables<"registration">;
}) {
  const router = useRouter();
  const params = useParams();
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<OtpInputType>({
    resolver: zodResolver(otpInputSchema),
  });

  const onSubmit = async (values: OtpInputType) => {
    try {
      const response = await fetch("/api/user/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: values.otp, userId: params.userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      router.replace(`/enroll/password-setup/${data.registration.id}`);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <div className="card w-full max-w-lg border-t-4 border-primary bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title block text-center">OTP Verification</h2>
        <span className="text-center">
          Please enter the verification code sent to{" "}
          <span className="text-primary underline">
            {registationRecord.email}
          </span>
          .<span className="inline-block text-blue-500"></span>
        </span>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-wrap  justify-center gap-1">
            <Controller
              name="otp"
              defaultValue=""
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <OtpInputRef
                  {...field}
                  numInputs={5}
                  onChange={(value) => field.onChange(value)}
                  inputStyle={{
                    width: "3rem",
                    height: "3rem",
                    fontSize: "2rem",
                    borderRadius: "4px",
                    border: "1px solid rgba(0,0,0,0.3)",
                  }}
                  containerStyle={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "1rem",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  value={field.value}
                  renderInput={(props) => <input {...props} />}
                  inputType="tel"
                />
              )}
            />
          </div>
          {errors.otp && (
            <span className="block text-center text-sm text-red-500">
              {errors.otp.message}
            </span>
          )}
          <div className="card-actions flex flex-col-reverse items-center justify-start xs:flex-row-reverse">
            <SubmitButton isSubmitting={isSubmitting} />
            <ResendButton isSubmitting={isSubmitting} />
          </div>
        </form>
      </div>
    </div>
  );
}
