import { NextResponse } from "next/server";
import supabase from "utils/supabase";
import { z } from "zod";

const uploadSchema = z.array(
  z.object({
    subject_code: z.string(),
    subject_name: z.string(),
    instructor: z.string(),
    units: z.string(),
    year_level: z.enum([
      "First Year",
      "Second Year",
      "Third Year",
      "Fourth Year",
    ]),
    program: z.string(),
    section: z.string(),
    subject_schedule: z.array(
      z.object({
        start: z.string(),
        end: z.string(),
        day: z.enum([
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ]),
        room: z.string(),
      })
    ),
  })
);

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const validatedBody = uploadSchema.safeParse(body);

  if (!validatedBody.success) {
    return NextResponse.json({ message: "Validation failed" }, { status: 401 });
  }

  const schedules = validatedBody.data;

  try {
    schedules?.forEach(async (subject) => {
      const {
        instructor,
        program,
        section,
        subject_code,
        subject_name,
        subject_schedule,
        units,
        year_level,
      } = subject;

      const { data: newSubject, error: newSubjectError } = await supabase
        .from("subject")
        .insert({
          instructor,
          program,
          section,
          units,
          subject_code,
          subject_name,
          year_level,
        })
        .select()
        .single();

      if (newSubjectError) {
        return NextResponse.json(
          {
            message: "Something wrong occured",
            error: newSubjectError.message,
          },
          { status: 401 }
        );
      }

      subject_schedule.forEach(async (schedule) => {
        const { day, end, room, start } = schedule;

        const { error: newScheduleError } = await supabase
          .from("subject_schedule")
          .insert({
            day,
            end,
            room,
            start,
            subject_id: newSubject?.id,
          })
          .select()
          .single();

        if (newScheduleError) {
          return NextResponse.json(
            {
              message: "Something wrong occured",
              error: newScheduleError.message,
            },
            { status: 401 }
          );
        }
      });
    });

    return NextResponse.json(
      { message: "Subjects uploaded successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 501 }
    );
  }
}
