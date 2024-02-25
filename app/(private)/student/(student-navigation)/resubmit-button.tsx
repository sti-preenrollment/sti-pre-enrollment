import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import supabase from "utils/supabase";

function ResubmitButton({
  studentId,
  studentType,
}: {
  studentId: string;
  studentType: "new" | "old";
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const handleResubmit = async () => {
    setIsLoading(true);
    try {
      await supabase
        .from(
          studentType === "new"
            ? "enrollment_application"
            : "subject_assessment"
        )
        .delete()
        .eq(
          studentType === "new"
            ? "enrollment_application_id"
            : "subject_assessment_id",
          studentId
        );

      setIsVisible(false);
      router.push(
        studentType === "new"
          ? "/student/enrollment-application-form"
          : "/student/subject-assessment-form"
      );
    } catch (error) {
      toast.error("Something went wrong.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return;

  return (
    <div className="space-y-2">
      <h3>You are allowed to resubmit.</h3>
      <button
        disabled={isLoading}
        onClick={handleResubmit}
        className="btn btn-error text-white"
      >
        Resubmit
      </button>
    </div>
  );
}
export default ResubmitButton;
