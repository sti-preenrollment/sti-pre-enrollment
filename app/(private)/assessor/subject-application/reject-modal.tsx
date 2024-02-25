"use client";

import { modalAction } from "@helper/modalAction";
import { useCreateQueryString } from "@hooks/useCreateQueryString";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import supabase from "utils/supabase";

function RejectModal() {
  const router = useRouter();
  const createQueryString = useCreateQueryString();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [isAllow, setIsAllow] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleReject = async () => {
    setIsLoading(true);
    try {
      await supabase
        .from("subject_assessment")
        .update({ status: "rejected" })
        .eq("subject_assessment_id", id!);

      await supabase.from("audit_trail").insert({
        action: "rejected",
        allow_resubmission: isAllow,
        message,
        student: id!,
        performer_id: session?.user.id,
        performer_name: session?.user.name,
      });

      toast.success("Enrollment application rejected");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setMessage("");
      setIsAllow(false);

      modalAction("reject_modal", "close");
      modalAction("assessment_modal", "close");

      router.push("?" + createQueryString("id", ""));
    }
  };

  return (
    <dialog id="reject_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Reject Enrollment Application!</h3>

        <div className="flex flex-col gap-2 my-5">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="textarea textarea-bordered focus:outline-primary w-full h-20"
            placeholder="Reason for rejection"
          ></textarea>
          <label className="flex gap-2">
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={isAllow}
              onChange={() => setIsAllow((prev) => !prev)}
            />{" "}
            <span>Allow resubmission?</span>
          </label>
        </div>

        <div className="modal-action">
          <form method="dialog">
            <button disabled={isLoading} className="btn btn-error text-white">
              Close
            </button>
          </form>
          <button
            onClick={handleReject}
            disabled={isLoading}
            className="btn btn-success text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </dialog>
  );
}
export default RejectModal;
