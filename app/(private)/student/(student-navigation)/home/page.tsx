import { authOptions } from "@lib/auth";
import { getServerSession } from "next-auth";
import StudentHome from "../student-home";
import supabase from "utils/supabase";
import { notFound } from "next/navigation";

const getUserInfo = async (userId: string) => {
  const { data } = await supabase
    .from("user_infomation")
    .select()
    .eq("user_id", userId)
    .single();
  return data;
};

async function Student() {
  const session = await getServerSession(authOptions);
  const userInfo = await getUserInfo(session?.user.id!);

  const { data: enrollment } = await supabase
    .from("enrollment_application")
    .select()
    .eq("enrollment_application_id", session?.user.id!)
    .single();

  const { data: assessment } = await supabase
    .from("subject_assessment")
    .select()
    .eq("subject_assessment_id", session?.user.id!)
    .single();

  if (
    (!enrollment && userInfo?.student_type === "new_student") ||
    (!assessment && userInfo?.student_type === "old_student")
  ) {
    return notFound();
  }

  return (
    <>
      <StudentHome userId={session?.user.id!} userInfo={userInfo!} />
    </>
  );
}
export default Student;
