"use client";

import Status from "./status";
import Link from "next/link";
import EditMessage from "./edit-message";
import { useEffect, useState } from "react";
import { Tables } from "types/supabase-helpers";
import supabase from "utils/supabase";
import { LoadingComponent } from "@components/ui";
import ResubmitButton from "./resubmit-button";

function StudentHome({
  userId,
  userInfo,
}: {
  userId: string;
  userInfo: Tables<"user_infomation">;
}) {
  const [auditTrail, setAuditTrail] = useState<Tables<"audit_trail"> | null>(
    null
  );
  const [status, setStatus] = useState<
    "pending" | "approved" | "rejected" | null
  >();

  useEffect(() => {
    (async () => {
      if (userInfo.student_type === "new_student") {
        const { data } = await supabase
          .from("enrollment_application")
          .select("status")
          .eq("enrollment_application_id", userId)
          .single();

        setStatus(data?.status);
      } else {
        const { data } = await supabase
          .from("subject_assessment")
          .select("status")
          .eq("subject_assessment_id", userId)
          .single();

        setStatus(data?.status);
      }
    })();
  }, [userId, userInfo.student_type]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("audit_trail")
        .select()
        .eq("student", userId)
        .single();

      setAuditTrail(data);
    })();
  }, [status, userId, userInfo.student_type]);

  return !status && !auditTrail ? (
    <div className="flex justify-center">
      <LoadingComponent size="md" />
    </div>
  ) : (
    <div className="max-w-xl mx-auto">
      <Status status={status ?? ""} />
      {userInfo && (
        <div className="card bg-base-100 shadow-lg ">
          <div className="card-body">
            <h3 className="card-title text-base">
              Hello{" "}
              {`${userInfo.firstname} ${userInfo.middlename} ${userInfo.lastname} ${userInfo.suffix}`}
            </h3>
            {status === "pending" &&
              (userInfo?.student_type === "new_student" ? (
                <p>
                  Your application is currently under review, and we appreciate
                  your patience. We will notify you of the status as soon as
                  possible.
                </p>
              ) : (
                <p>
                  The subjects you are applying for are currently under review,
                  and we thank you for your patience. We will inform you of the
                  status as soon as it becomes available.
                </p>
              ))}
            {status === "approved" &&
              (userInfo?.student_type === "new_student" ? (
                <p>
                  Your application has been approved! Kindly proceed to the site
                  with the necessary hard copy attachments for enrollment.
                </p>
              ) : (
                <p>
                  Your application has been approved! Kindly proceed to the site
                  for enrollment. Here are your schedules:{"  "}
                  <Link className="link" href={"/student/schedules"}>
                    View schedules
                  </Link>
                </p>
              ))}
            {status === "rejected" &&
              (userInfo?.student_type === "new_student" ? (
                <>
                  <p>
                    We regret to inform you that your application has been
                    rejected. Please review the provided reason for further
                    details.
                  </p>
                  <div>
                    <div>
                      <span className="font-semibold">Admission:</span>
                      {auditTrail?.performer_name}
                    </div>
                    <div>
                      <span className="font-semibold">Message: </span>
                      {auditTrail?.message}
                    </div>
                  </div>
                  {auditTrail?.allow_resubmission && (
                    <ResubmitButton studentId={userId} studentType="new" />
                  )}
                </>
              ) : (
                <>
                  <p>
                    We regret to inform you that your application has been
                    rejected. Please review the provided reason for further
                    details.
                  </p>
                  <div>
                    <div>
                      <span className="font-semibold">Admission:</span>{" "}
                      {auditTrail?.performer_name}
                    </div>
                    <div>
                      <span className="font-semibold">Message: </span>{" "}
                      {auditTrail?.message}
                    </div>
                  </div>
                  {auditTrail?.allow_resubmission && (
                    <ResubmitButton studentId={userId} studentType="old" />
                  )}
                </>
              ))}
          </div>
        </div>
      )}
      {auditTrail &&
        auditTrail?.action === "edited" &&
        !auditTrail.is_ok_changes && (
          <EditMessage
            assessor={auditTrail?.performer_name!}
            message={auditTrail?.message!}
            studentId={userId}
          />
        )}
    </div>
  );
}
export default StudentHome;
