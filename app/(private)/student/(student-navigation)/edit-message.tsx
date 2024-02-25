"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import supabase from "utils/supabase";

function EditMessage({
  assessor,
  message,
  studentId,
}: {
  assessor: string;
  message: string;
  studentId: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const handleOkayToChanges = async () => {
    setIsLoading(true);
    try {
      await supabase
        .from("audit_trail")
        .update({ is_ok_changes: true })
        .eq("student", studentId);

      await supabase
        .from("subject_assessment")
        .update({ print_status: "for printing" })
        .eq("subject_assessment_id", studentId);

      setIsVisible(false);
    } catch (error) {
      toast.error("Something went wrong.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleResubmit = async () => {
    setIsLoading(true);
    try {
      await supabase
        .from("subject_assessment")
        .delete()
        .eq("subject_assessment_id", studentId);

      setIsVisible(false);
      router.push("/student/subject-assessment-form");
    } catch (error) {
      toast.error("Something went wrong.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return;

  return (
    <div className="my-3 card bg-base-100 shadow-lg">
      <div className="card-body">
        <p>
          The changes to your subject selection have been made. Please review
          the updated selection. If you are satisfied with the changes, click{" "}
          <strong>Okay</strong>. If you wish to make further changes, click{" "}
          <strong>Resubmit</strong>.
        </p>
        <div>
          <span className="font-semibold">Assessor:</span>
          {assessor}
        </div>
        <div>
          <span className="font-semibold">Message: </span>
          {message}
        </div>
        <div>
          <span>Are you okay with the changes?</span>
          <div className="space-x-2">
            <button
              disabled={isLoading}
              onClick={handleResubmit}
              className="btn btn-error text-white"
            >
              Resubmit
            </button>
            <button
              disabled={isLoading}
              onClick={handleOkayToChanges}
              className="btn btn-success text-white"
            >
              Okay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default EditMessage;
