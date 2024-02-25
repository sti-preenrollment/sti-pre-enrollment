import supabase from "utils/supabase";
import StudentListTable from "./student-list-table";
import DeleteModal from "./delete-modal";
import ScheduleModal from "./schedule-modal";
import TruncateModal from "./truncate-modal";

export const revalidate = 0;

async function ScheduleList() {
  const { data: subjectList } = await supabase.from("subject").select("*");

  return (
    <>
      <StudentListTable initialSubjectList={subjectList ?? []} />

      <DeleteModal />
      <ScheduleModal />
      <TruncateModal />
    </>
  );
}
export default ScheduleList;
