import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import supabase from "utils/supabase";
import { z } from "zod";

const editInfoSchema = z.object({
  userId: z.string(),
  email: z.string(),
  name: z.string(),
  password: z.string(),
  updatePassword: z.boolean(),
  role: z.enum(["student", "admission", "assessor"]),
});

export async function PATCH(request: Request) {
  const body: unknown = await request.json();
  const bodyValidation = editInfoSchema.safeParse(body);

  if (!bodyValidation.success) {
    return NextResponse.json({ message: "Validation failed" }, { status: 401 });
  }

  const { email, name, updatePassword, password, role, userId } =
    bodyValidation.data;

  const { data: userExist } = await supabase
    .from("user")
    .select()
    .eq("id", userId)
    .single();

  if (!userExist) {
    return NextResponse.json(
      { message: "User does not exist" },
      { status: 401 }
    );
  }

  try {
    if (updatePassword) {
      const hashedPassword = await hash(password, 10);
      const { error: updateUserError } = await supabase
        .from("user")
        .update({ email, name, password: hashedPassword, role })
        .eq("id", userId);

      if (updateUserError) {
        return NextResponse.json(
          {
            message: "Something wrong occured.",
            error: updateUserError.message,
          },
          { status: 401 }
        );
      }
    } else {
      const { error: updateUserError } = await supabase
        .from("user")
        .update({ email, name, role })
        .eq("id", userId);

      if (updateUserError) {
        return NextResponse.json(
          {
            message: "Something wrong occured.",
            error: updateUserError.message,
          },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { message: "User successfully updated." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something wrong occured.", error: error },
      { status: 401 }
    );
  }
}
