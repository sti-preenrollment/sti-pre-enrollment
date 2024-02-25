import { groupSchedules } from "@helper/groupSchedules";
import { authOptions } from "@lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import supabase from "utils/supabase";

export const revalidate = 0;

async function Schedules() {
  const session = await getServerSession(authOptions);
  const { data: userInfo } = await supabase
    .from("user_infomation")
    .select("student_type")
    .eq("user_id", session?.user.id!)
    .single();

  const { data: assessment } = await supabase
    .from("subject_assessment")
    .select("status,subject(*, subject_schedule(*))")
    .eq("subject_assessment_id", session?.user.id!)
    .single();

  if (userInfo?.student_type !== "old_student" || !assessment) {
    return notFound();
  }

  return (
    <div className="card bg-base-100 shadow-lg max-w-xl mx-auto">
      <div className="card-body">
        <h2 className="card-title">Schedules</h2>
        {assessment?.status != "approved" ? (
          <div className="h-20 grid place-items-center">
            <span className="text-neutral-500 text-sm">No schedules</span>
          </div>
        ) : (
          <div>
            {assessment?.subject.map((subject) => {
              const groupedSchedules = groupSchedules(subject.subject_schedule);

              return (
                <div key={subject.id} className="border  px-2 py-1">
                  <div className="font-semibold">{subject.subject_name}</div>
                  {subject.instructor !== "" && (
                    <div className="text-neutral-500 text-xs">
                      {subject.instructor}
                    </div>
                  )}

                  <div className="text-neutral-500 text-xs">
                    {subject.section}
                  </div>
                  <div className="text-neutral-500 text-xs">
                    {groupedSchedules.map((schedule, index) => (
                      <div key={index} className="min-w-[15rem]">
                        <span className="capitalize font-semibold">
                          {schedule.days.join("/")}
                        </span>
                        {` - ${schedule.time} - ${schedule.room}`}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
export default Schedules;
