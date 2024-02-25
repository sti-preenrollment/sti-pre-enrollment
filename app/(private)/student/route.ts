import { authOptions } from "@lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import supabase from "utils/supabase";

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  const { data: userInfo } = await supabase
    .from("user_infomation")
    .select("student_type")
    .eq("user_id", session?.user.id!)
    .single();

  if (userInfo?.student_type === "new_student") {
    const { data: enrollment } = await supabase
      .from("enrollment_application")
      .select()
      .eq("enrollment_application_id", session?.user.id!)
      .single();

    if (!enrollment) {
      return NextResponse.redirect(
        new URL("/student/enrollment-application-form", req.url)
      );
    }
  } else {
    const { data: assessment } = await supabase
      .from("subject_assessment")
      .select()
      .eq("subject_assessment_id", session?.user.id!)
      .single();

    if (!assessment) {
      return NextResponse.redirect(
        new URL("/student/subject-assessment-form", req.url)
      );
    }
  }

  return NextResponse.redirect(new URL(`/student/home`, req.url));
}
