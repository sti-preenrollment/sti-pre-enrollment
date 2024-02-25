import generateOtp from "@helper/generateOtp";
import sendEmail from "@helper/sendEmail";
import addOtp from "@helper/addOtp";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import supabase from "utils/supabase";

const registerUserSchema = z.object({
  firstName: z.string().min(1),
  middleName: z.string(),
  lastName: z.string().min(1),
  suffix: z.string(),
  contact: z.string().min(1),
  email: z.string().email().min(1),
  studentNo: z.string().nullable(),
  lastSchool: z.string().nullable(),
  studentType: z.enum(["new_student", "old_student"]),
});

export async function POST(req: NextRequest) {
  const body: unknown = await req.json();
  const validated = registerUserSchema.safeParse(body);

  if (!validated.success) {
    return NextResponse.json(
      { message: "The validation process has failed." },
      { status: 409 }
    );
  }

  const {
    firstName,
    middleName,
    lastName,
    suffix,
    lastSchool,
    contact,
    email,
    studentNo,
    studentType,
  } = validated.data;

  const { data: userExist } = await supabase
    .from("user")
    .select()
    .eq("email", email)
    .single();

  if (userExist) {
    return NextResponse.json(
      {
        message:
          "A user with this email already exists. Please try logging in.",
      },
      { status: 401 }
    );
  }

  const { data: registrationEmailExist } = await supabase
    .from("registration")
    .select()
    .eq("email", email)
    .single();

  if (registrationEmailExist) {
    await supabase.from("registration").delete().eq("email", email);
  }

  try {
    const { data: newUserRegistration, error: registrationError } =
      await supabase
        .from("registration")
        .insert({
          contact,
          student_type: studentType,
          email,
          firstname: firstName,
          middlename: middleName,
          lastname: lastName,
          student_number: studentNo,
          suffix,
          last_school: lastSchool,
        })
        .select()
        .single();

    if (registrationError) {
      return NextResponse.json(
        {
          message: "There is an error during registration. Try again",
          error: registrationError.message,
        },
        { status: 401 }
      );
    }

    const otp = await generateOtp();

    await sendEmail(newUserRegistration?.email, otp);

    await addOtp({
      email: newUserRegistration.email,
      userId: newUserRegistration.id,
      otp,
    });

    return NextResponse.json(
      {
        message: "User registered successfully and otp is sent to the email",
        newUserRegistration,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong. Try again.", error },
      { status: 401 }
    );
  }
}
