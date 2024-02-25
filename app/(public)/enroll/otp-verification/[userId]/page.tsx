import { Otp } from "@assets/illustrations";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import supabase from "utils/supabase";
const OtpForm = dynamic(() => import("./otp-form"), { ssr: false });

export const revalidate = 0;

async function OtpVerification({ params }: { params: { userId: string } }) {
  const { data: registationRecord } = await supabase
    .from("registration")
    .select()
    .eq("id", params.userId)
    .single();

  if (!registationRecord || registationRecord.verified === true) {
    notFound();
  }

  return (
    <div className="flex h-full justify-center lg:items-center">
      <div className="contaier mx-auto flex flex-shrink flex-col items-center gap-5 px-2 lg:flex-row-reverse">
        <Otp className="max-w-[15rem] drop-shadow-2xl xs:max-w-xs lg:max-w-lg" />
        <OtpForm registationRecord={registationRecord || {}} />
      </div>
    </div>
  );
}
export default OtpVerification;
