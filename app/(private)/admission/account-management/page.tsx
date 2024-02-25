import supabase from "utils/supabase";
import UserListTable from "./user-list-table";
import EditModal from "./edit-modal";
import DeleteModal from "./delete-modal";
import { Toaster } from "sonner";
import TruncateModal from "./truncate-modal";

export const revalidate = 0;

async function AccountManagement() {
  const { data: userList } = await supabase.from("user").select("*");

  return (
    <>
      <UserListTable initialUserList={userList ?? []} />

      <EditModal />
      <DeleteModal />
      <TruncateModal />
      <Toaster expand={true} richColors />
    </>
  );
}
export default AccountManagement;
