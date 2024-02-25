import { NextResponse } from "next/server";
import z from "zod";
import { hash } from "bcrypt";
import supabase from "utils/supabase";

const passwordSetupSchema = z.object({
  userId: z.string().min(1),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  const body: unknown = await req.json();
  const bodyValidation = passwordSetupSchema.safeParse(body);

  if (!bodyValidation.success) {
    return NextResponse.json({ message: "Validation failed" }, { status: 401 });
  }

  const { password, userId } = bodyValidation.data;

  const { data: userExistByEmail } = await supabase
    .from("user")
    .select()
    .eq("id", userId)
    .single();

  if (userExistByEmail) {
    return NextResponse.json(
      { message: "A user with this email already exists." },
      { status: 401 }
    );
  }

  const { data: registrationInfo } = await supabase
    .from("registration")
    .select()
    .eq("id", userId)
    .single();

  if (!registrationInfo) {
    return NextResponse.json(
      { message: "The user registration information cannot be found." },
      { status: 401 }
    );
  }

  const {
    contact,
    email,
    firstname,
    lastname,
    last_school,
    middlename,
    student_number,
    student_type,
    suffix,
    id,
  } = registrationInfo;

  try {
    const hashedPassword = await hash(password, 10);

    const { data: newUser, error: newUserError } = await supabase
      .from("user")
      .insert({
        email,
        name: `${firstname} ${middlename.charAt(0)} ${lastname} ${suffix}`,
        password: hashedPassword,
        role: "student",
        id,
      })
      .select()
      .single();

    if (newUserError) {
      return NextResponse.json(
        { message: newUserError.message },
        { status: 401 }
      );
    }

    const { error: newUserInformationError } = await supabase
      .from("user_infomation")
      .insert({
        user_id: newUser.id,
        contact,
        email,
        firstname,
        lastname,
        student_type,
        last_school,
        middlename,
        student_number,
        suffix,
      });

    if (newUserInformationError) {
      return NextResponse.json(
        { message: newUserInformationError.message },
        { status: 401 }
      );
    }

    await supabase.from("registration").delete().eq("id", id);

    return NextResponse.json(
      { message: "The user has been successfully registered." },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error has occurred." },
      { status: 501 }
    );
  }
}
