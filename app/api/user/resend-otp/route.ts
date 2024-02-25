import addOtp from "@helper/addOtp";
import generateOtp from "@helper/generateOtp";
import sendEmail from "@helper/sendEmail";
import { NextResponse } from "next/server";
import supabase from "utils/supabase";
import z from "zod";

const userIdSchema = z.string().min(1);

export async function POST(req: Request) {
  const body: unknown = await req.json();
  const validatedId = userIdSchema.parse(body);

  const { data: registered, error: registeredError } = await supabase
    .from("registration")
    .select()
    .eq("id", validatedId)
    .single();

  if (registeredError) {
    return NextResponse.json(
      { message: registeredError.message },
      { status: 401 }
    );
  }

  if (!registered) {
    return NextResponse.json(
      { message: "No user in registration found" },
      { status: 401 }
    );
  }

  try {
    const otp = await generateOtp();
    await sendEmail(registered.email, otp);

    await addOtp({
      email: registered.email,
      userId: registered.id,
      otp,
    });

    return NextResponse.json(
      { message: "A new OTP has been sent." },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred. Please try again." },
      { status: 401 }
    );
  }
}
