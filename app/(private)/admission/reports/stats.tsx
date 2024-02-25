import { DocumentText, Users } from "@assets/icons";
import supabase from "utils/supabase";

export const revalidate = 0;

async function Stats() {
  const { count: studentCount } = await supabase
    .from("user_infomation")
    .select("*", { count: "exact", head: true });

  const { count: applicationCount } = await supabase
    .from("enrollment_application")
    .select("*", { count: "exact", head: true });

  const { count: newStudent } = await supabase
    .from("user_infomation")
    .select("*", { count: "exact", head: true })
    .eq("student_type", "new_student");
  const { count: tranferee } = await supabase
    .from("user_infomation")
    .select("*", { count: "exact", head: true })
    .eq("student_type", "old_student");

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2">
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-figure text-primary">
            <Users className="w-10" />
          </div>
          <div className="stat-title whitespace-pre-wrap">
            Total Number of Students
          </div>
          <div className="stat-value text-primary">{studentCount}</div>
        </div>
      </div>
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-figure text-primary">
            <DocumentText className="w-10" />
          </div>
          <div className="stat-title whitespace-pre-wrap">
            Total Enrollment Application
          </div>
          <div className="stat-value text-primary">{applicationCount}</div>
        </div>
      </div>
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-figure text-primary">
            <Users className="w-10" />
          </div>
          <div className="stat-title whitespace-pre-wrap">
            Total Number of New Students
          </div>
          <div className="stat-value text-primary">{newStudent}</div>
        </div>
      </div>
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-figure text-primary">
            <Users className="w-10" />
          </div>
          <div className="stat-title whitespace-pre-wrap">
            Total Number of Old Students
          </div>
          <div className="stat-value text-primary">{tranferee}</div>
        </div>
      </div>
    </div>
  );
}
export default Stats;
