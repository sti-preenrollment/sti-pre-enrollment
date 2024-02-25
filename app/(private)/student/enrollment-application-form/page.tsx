import supabase from "utils/supabase";
import ApplicationForm from "./application-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@lib/auth";
import { notFound } from "next/navigation";

export const revalidate = 0;

async function InfoSetupPage() {
  const session = await getServerSession(authOptions);
  const { data: enrollment } = await supabase
    .from("enrollment_application")
    .select()
    .eq("enrollment_application_id", session?.user.id!)
    .single();
  const { data: userInfo } = await supabase
    .from("user_infomation")
    .select()
    .eq("user_id", session?.user.id!)
    .single();

  if (userInfo?.student_type !== "new_student" || enrollment) {
    return notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-3">
      <ApplicationForm userInfo={userInfo!} />
    </div>
  );
}

export default InfoSetupPage;
