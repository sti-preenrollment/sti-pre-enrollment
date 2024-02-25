import { ForcedPassword } from "@assets/illustrations";
import PasswordSetupForm from "./password-form";
import { notFound } from "next/navigation";
import supabase from "utils/supabase";

export const revalidate = 0;

async function PasswordSetupPage({ params }: { params: { userId: string } }) {
  const { data: registationRecord } = await supabase
    .from("registration")
    .select()
    .eq("id", params.userId)
    .single();

  if (!registationRecord || !registationRecord.verified) {
    notFound();
  }

  return (
    <main className="grid h-full place-items-center">
      <div className="container mx-auto flex items-center justify-center gap-14">
        <ForcedPassword className="hidden w-[30rem] drop-shadow-2xl md:block" />
        <PasswordSetupForm />
      </div>
    </main>
  );
}

export default PasswordSetupPage;
