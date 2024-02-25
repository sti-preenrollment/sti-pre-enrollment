import { Photo } from "@assets/icons";
import { authOptions } from "@lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import supabase from "utils/supabase";

async function Attachments() {
  const session = await getServerSession(authOptions);
  const { data: enrollment } = await supabase
    .from("enrollment_application")
    .select("attachment")
    .eq("enrollment_application_id", session?.user.id!)
    .single();
  const { data: userInfo } = await supabase
    .from("user_infomation")
    .select()
    .eq("user_id", session?.user.id!)
    .single();

  if (userInfo?.student_type !== "new_student" || !enrollment) {
    return notFound();
  }

  return (
    <div className="card bg-base-100 shadow-lg max-w-xl mx-auto">
      <div className="card-body">
        <h2 className="card-title">Attachments</h2>
        <div className="flex flex-row gap-2">
          {enrollment?.attachment?.map((image) => (
            <Link
              href={image}
              target="_blank"
              key={image}
              className="w-max p-2 rounded-lg border-2"
            >
              <Photo className="w-20 h-20 text-primary" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Attachments;
