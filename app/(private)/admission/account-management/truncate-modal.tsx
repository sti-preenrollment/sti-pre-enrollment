"use client";

import { modalAction } from "@helper/modalAction";
import { useState } from "react";
import { toast } from "sonner";
import supabase from "utils/supabase";

function TruncateModal() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const deleteUser = async () => {
    setIsLoading(true);
    try {
      await supabase.from("user").delete().eq("role", "student");

      toast.success("All student data truncated successfully.");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);

      modalAction("truncate_modal", "close");
    }
  };

  return (
    <dialog id="truncate_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Truncate Student Data!</h3>
        <p className="py-4">
          Are you sure you want to truncate all student data?
        </p>
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
export default TruncateModal;
