import { authOptions } from "@lib/auth";
import { getServerSession } from "next-auth";
import supabase from "utils/supabase";
import NewStudentNav from "./new-student-nav";
import OldStudentNav from "./old-student-nav";

const getUserInfo = async (userId: string) => {
  const { data } = await supabase
    .from("user_infomation")
    .select()
    .eq("user_id", userId)
    .single();

  return data;
};

async function HomeLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const userInfo = await getUserInfo(session?.user.id!);

  return (
    <>
      {userInfo?.student_type === "new_student" ? (
        <NewStudentNav />
      ) : (
        <OldStudentNav />
      )}

      {children}
    </>
  );
}
export default HomeLayout;
