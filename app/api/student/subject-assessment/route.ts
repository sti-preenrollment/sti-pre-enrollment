import { NextRequest, NextResponse } from "next/server";
import supabase from "utils/supabase";
import { z } from "zod";

const SubjectSchedule = z.object({
  id: z.string(),
  created_at: z.string(),
  start: z.string(),
  end: z.string(),
  day: z.string(),
  room: z.string(),
  subject_id: z.string(),
});

const Subject = z.object({
  id: z.string(),
  created_at: z.string(),
  subject_name: z.string(),
  subject_code: z.string(),
  instructor: z.string().nullable(),
  year_level: z.string(),
  section: z.string(),
  program: z.string(),
  subject_schedule: z.array(SubjectSchedule),
});

const addAssessmentSchema = z.object({
  userId: z.string(),
  studentType: z.enum(["regular", "irregular"]),
  yearLevel: z.enum(["First Year", "Second Year", "Third Year", "Fourth Year"]),
  program: z.string(),
  section: z.string(),
  subjects: z.array(Subject),
});

export async function POST(req: Request) {
  const body: unknown = await req.json();
  const validation = addAssessmentSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { message: "Validation failed." },
      { status: 401 }
    );
  }

  const { program, userId, section, studentType, subjects, yearLevel } =
    validation.data;

  const { data: subjectAssessmentExist } = await supabase
    .from("subject_assessment")
    .select()
    .eq("subject_assessment_id", userId)
    .single();

  if (subjectAssessmentExist) {
    await supabase
      .from("subject_assessment")
      .delete()
      .eq("subject_assessment_id", userId);
  }
  try {
    const { data: newSubjectAssessment, error: newSubjectAssessmentError } =
      await supabase
        .from("subject_assessment")
        .insert({
          subject_assessment_id: userId,
          program,
          section,
          student_status: studentType,
          year: yearLevel,
        })
        .select()
        .single();

    if (newSubjectAssessmentError) {
      return NextResponse.json(
        {
          message: "An issue occured during the adding proceess. Try again",
          error: newSubjectAssessmentError.message,
        },
        { status: 401 }
      );
    }

    // Delete all the existing relation
    await supabase.from("rel_subject_subject_assessment").delete().match({
      subject_assessment_id: newSubjectAssessment?.subject_assessment_id,
    });

    // Add new subject to subject assessment relation
    const { error: newSubjectToSubjectAssessmentError } = await supabase
      .from("rel_subject_subject_assessment")
      .insert(
        subjects.map((subject) => ({
          subject_id: subject.id,
          subject_assessment_id: newSubjectAssessment?.subject_assessment_id,
        }))
      );

    if (newSubjectToSubjectAssessmentError) {
      return NextResponse.json(
        {
          message: "An issue occured during the adding proceess. Try again",
          error: newSubjectToSubjectAssessmentError.message,
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: "New subject assessment added successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 501 }
    );
  }
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "No id provided" }, { status: 401 });
  }

  try {
    const {
      data: studentSubjectAssessment,
      error: studentSubjectAssessmentError,
    } = await supabase
      .from("subject_assessment")
      .select(
        "*, user_infomation(firstname, middlename, lastname, suffix, email, student_number), subject(*, subject_schedule(*))"
      )
      .eq("subject_assessment_id", id)
      .single();

    if (studentSubjectAssessmentError) {
      return NextResponse.json(
        {
          message: "An error occured",
          error: studentSubjectAssessmentError.message,
        },
        { status: 401 }
      );
    }

    return NextResponse.json(studentSubjectAssessment, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 401 }
    );
  }
}
