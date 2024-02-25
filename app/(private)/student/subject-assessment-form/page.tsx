import AssessmentForm from "./assessment-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@lib/auth";
import supabase from "utils/supabase";
import { notFound } from "next/navigation";

export default async function SubjectAssessmentForm() {
  const session = await getServerSession(authOptions);
  const { data: assessment } = await supabase
    .from("subject_assessment")
    .select()
    .eq("subject_assessment_id", session?.user.id!)
    .single();
  const { data: userInfo } = await supabase
    .from("user_infomation")
    .select()
    .eq("user_id", session?.user.id!)
    .single();

  if (userInfo?.student_type !== "old_student" || assessment) {
    return notFound();
  }

  return (
    <>
      <AssessmentForm userId={session?.user.id!} />
    </>
  );
}
