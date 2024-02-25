import { hash } from "bcrypt";
import supabase from "utils/supabase";

type AddOtpType = {
  email: string;
  userId: string;
  otp: string;
};

export default async function addOtp({ email, userId, otp }: AddOtpType) {
  const oneHour = new Date();
  oneHour.setHours(oneHour.getHours() + 1);
  const hashedOtp = await hash(otp, 10);

  let { data: otpExist } = await supabase
    .from("otp")
    .select()
    .eq("user_id", userId)
    .single();

  if (otpExist) {
    await supabase.from("otp").delete().eq("id", userId);
  }

  try {
    const { data: newOtp } = await supabase
      .from("otp")
      .insert({
        email,
        expired_at: oneHour.toLocaleString(),
        otp: hashedOtp,
        user_id: userId,
      })
      .select()
      .single();

    return newOtp;
  } catch (error) {
    throw error;
  }
}
