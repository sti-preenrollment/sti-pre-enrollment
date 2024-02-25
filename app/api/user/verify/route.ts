import { compare } from "bcrypt";
import { NextResponse } from "next/server";
import supabase from "utils/supabase";
import z from "zod";

const otpSchema = z.object({
  otp: z.string().min(1),
  userId: z.string().min(1),
});
export async function POST(req: Request) {
  const body = await req.json();
  const validated = otpSchema.safeParse(body);

  if (!validated.success)
    return NextResponse.json(
      { message: "The validation process has failed." },
      { status: 409 }
    );

  const { userId, otp } = validated.data;

  const { data: userExist } = await supabase
    .from("user")
    .select()
    .eq("id", userId)
    .select()
    .single();

  if (userExist) {
    await supabase.from("otp").delete().eq("user_id", userId);

    return NextResponse.json(
      { message: "The user already exists." },
      { status: 401 }
    );
  }

  const { data: otpExist } = await supabase
    .from("otp")
    .select()
    .eq("user_id", userId)
    .single();

  if (!otpExist) {
    return NextResponse.json(
      { message: 'The user OTP does not exist. Please click "Resend OTP"' },
      { status: 401 }
    );
  }

  if (new Date(otpExist.expired_at) < new Date()) {
    await supabase.from("otp").delete().eq("user_id", userId);

    return NextResponse.json(
      { message: "The OTP code has expired. Please resend the OTP again." },
      { status: 401 }
    );
  }

  const otpMatched = await compare(otp, otpExist.otp);

  if (!otpMatched) {
    return NextResponse.json(
      { message: "The OTP does not match." },
      { status: 401 }
    );
  }

  await supabase.from("otp").delete().eq("user_id", userId);

  const { data: updatdRegistration, error: updatedRegistrationError } =
    await supabase
      .from("registration")
      .update({ verified: true })
      .eq("id", userId)
      .select()
      .single();

  if (updatedRegistrationError) {
    return NextResponse.json(
      {
        message: updatedRegistrationError.message,
      },
      { status: 501 }
    );
  }

  return NextResponse.json(
    {
      registration: updatdRegistration,
      message: "The OTP has been successfully matched.",
    },
    { status: 201 }
  );
}
