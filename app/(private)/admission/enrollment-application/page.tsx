import supabase from "utils/supabase";
import EnrollmentApplicationTable from "./enrollment-application-table";
import { EnrollmentApplication } from "./columns";
import EnrollmentModal from "./enrollment-modal";
import RejectModal from "./reject-modal";
import { Toaster } from "sonner";
import BasicInfoModal from "./basic-info-modal";

export const revalidate = 0;

async function StudAppAllPage() {
  const { data: enrollmentApplication } = await supabase
    .from("enrollment_application")
    .select(
      "enrollment_application_id, status, user_infomation(firstname, middlename, lastname, suffix, email)"
    )
    .order("created_at", { ascending: false });

  return (
    <>
      <EnrollmentApplicationTable
        initialEnrollmentApplication={
          (enrollmentApplication as unknown as EnrollmentApplication[]) ?? []
        }
      />
      <EnrollmentModal />
      <RejectModal />
      <BasicInfoModal />
      <Toaster expand={true} richColors />
    </>
  );
}

export default StudAppAllPage;
