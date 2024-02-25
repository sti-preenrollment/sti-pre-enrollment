import supabase from "utils/supabase";
import StudentListTable from "./student-list-table";
import StudentModal from "./student-modal";

export const revalidate = 0;

async function StudentList() {
  const { data: studentList } = await supabase
    .from("user_infomation")
    .select("*");

  return (
    <>
      <StudentListTable initialstudentList={studentList ?? []} />

      <StudentModal />
    </>
  );
}
export default StudentList;
