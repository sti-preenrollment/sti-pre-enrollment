"use client";

import { modalAction } from "@helper/modalAction";
import { useCreateQueryString } from "@hooks/useCreateQueryString";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import supabase from "utils/supabase";

function DeleteModal() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id")!;
  const createQueryString = useCreateQueryString();
  const router = useRouter();

  const deleteUser = async () => {
    setIsLoading(true);
    try {
      const { error: deleteError } = await supabase
        .from("subject")
        .delete()
        .eq("id", id);

      if (deleteError) {
        toast.error("Error occured during deletion. Try again.");
        console.error(deleteError.message);
        return;
      }

      toast.success("Subject deleted successfully.");
    } catch (error) {
      toast.error("Something went wrong during request.");
      console.error(error);
    } finally {
      setIsLoading(false);

      router.push("?" + createQueryString("id", ""));

      modalAction("delete_modal", "close");
    }
  };

  return (
    <dialog id="delete_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Delete Subject!</h3>
        <p className="py-4">Are you sure you want to delete this subject?</p>
        <div className="modal-action">
          <form method="dialog">
            <button disabled={isLoading} className="btn btn-error text-white">
              Cancel
            </button>
          </form>

          <button
            disabled={isLoading}
            onClick={deleteUser}
            className="btn btn-success text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </dialog>
  );
}
export default DeleteModal;
