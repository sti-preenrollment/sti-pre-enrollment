import supabase from "utils/supabase";
import SubjectAssessmentTable from "./assessment-table";
import { type SubjectAssessment } from "./columns";
import SubjectAssessmentModal from "./assessment-modal";
import RejectModal from "./reject-modal";
import EditModal from "./edit-modal";
import PrintModal from "./print-modal";

export const revalidate = 0;

async function SubjectAssessment() {
  const { data: enrollmentApplication } = await supabase
    .from("subject_assessment")
    .select(
      "subject_assessment_id, status, print_status, user_infomation(firstname, middlename, lastname, suffix, email)"
    )
    .order("created_at", { ascending: false });

  return (
    <>
      <SubjectAssessmentTable
        initialSubjectAssessment={
          (enrollmentApplication as unknown as SubjectAssessment[]) ?? []
        }
      />
      <SubjectAssessmentModal />
      <RejectModal />
      <EditModal />
      <PrintModal />
    </>
  );
}

export default SubjectAssessment;
