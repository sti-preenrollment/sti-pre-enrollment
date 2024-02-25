"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Tables } from "types/supabase-helpers";
import supabase from "utils/supabase";
import PrintTable from "./print-table";
import { useCreateQueryString } from "@hooks/useCreateQueryString";
import { modalAction } from "@helper/modalAction";
import { useReactToPrint } from "react-to-print";
import { countUnits } from "@helper/countUnits";
import { LoadingComponent } from "@components/ui";

type SubjectAssessment = Tables<"subject_assessment"> & {
  subject: Tables<"subject">[];
};

function PrintModal() {
  const router = useRouter();
  const createQueryString = useCreateQueryString();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const id = searchParams.get("id")!;
  const edit = searchParams.get("edit");
  const [userInfo, setUserInfo] = useState<Tables<"user_infomation"> | null>(
    null
  );
  const [assessment, setAssessment] = useState<SubjectAssessment | null>(null);
  const printAssessment = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printAssessment.current,
  });

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data: userInfo } = await supabase
        .from("user_infomation")
        .select()
        .eq("user_id", id)
        .single();

      const { data: assessment } = await supabase
        .from("subject_assessment")
        .select("*, subject(*)")
        .eq("subject_assessment_id", id)
        .single();

      setAssessment(assessment);
      setUserInfo(userInfo);
    })();
  }, [id, edit]);

  const handleClose = () => {
    setAssessment(null);
    setUserInfo(null);

    router.push("?" + createQueryString("edit", ""));
    modalAction("print_modal", "close");
    modalAction("assessment_modal", "open");
  };

  return (
    <dialog id="print_modal" className="modal p-5">
      <div className="modal-box relative w-full max-w-3xl overflow-hidden">
        <div ref={printAssessment} className="p-5">
          <h3 className="font-bold text-xl">Pre-Assessment Form</h3>
          {!userInfo ? (
            <div className="flex justify-center">
              <LoadingComponent size="md" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 my-3">
                <div className="grid grid-cols-4 items-center">
                  <label className="text-sm">Last Name</label>
                  <input
                    defaultValue={`${userInfo?.lastname}`}
                    type="text"
                    className="input input-bordered pointer-events-none bg-neutral-100 input-sm w-full col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center">
                  <label className="text-sm">Program</label>
                  <input
                    defaultValue={`${assessment?.program}`}
                    type="text"
                    className="input input-bordered pointer-events-none bg-neutral-100 input-sm w-full col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center">
                  <label className="text-sm">First Name</label>
                  <input
                    defaultValue={`${userInfo?.firstname}`}
                    type="text"
                    className="input input-bordered pointer-events-none bg-neutral-100 input-sm w-full col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center">
                  <label className="text-sm">Term/A.Y</label>
                  <input
                    type="text"
                    className="input input-bordered bg-neutral-100 input-sm w-full col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center">
                  <label className="text-sm">Middle Name</label>
                  <input
                    defaultValue={`${userInfo?.middlename}`}
                    type="text"
                    className="input input-bordered pointer-events-none bg-neutral-100 input-sm w-full col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center">
                  <label className="text-sm">Contact No.</label>
                  <input
                    defaultValue={`${userInfo?.contact}`}
                    type="text"
                    className="input input-bordered pointer-events-none bg-neutral-100 input-sm w-full col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center">
                  <label className="text-sm">Student No.</label>
                  <input
                    defaultValue={`${userInfo?.student_number}`}
                    type="text"
                    className="input input-bordered pointer-events-none bg-neutral-100 input-sm w-full col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center">
                  <label className="text-sm">Email</label>
                  <input
                    defaultValue={`${userInfo?.email}`}
                    type="text"
                    className="input input-bordered pointer-events-none bg-neutral-100 input-sm w-full col-span-3"
                  />
                </div>
              </div>

              <div>
                {!assessment ? (
                  <div className="flex justify-center">
                    <LoadingComponent size="md" />
                  </div>
                ) : (
                  <div>
                    <PrintTable subjects={assessment?.subject} />
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-between">
                <div className="flex items-center flex-col w-72">
                  <input
                    defaultValue={`${session?.user.name}`}
                    type="text"
                    className=" border-b border-b-neutral-300 pointer-events-none  input-sm w-56 col-span-3"
                  />
                  <label className="text-sm">
                    Designated Assessor{"'"}s Name & Signature
                  </label>
                </div>
                <div className="flex items-center flex-col w-56">
                  {assessment?.subject && (
                    <input
                      defaultValue={countUnits(assessment?.subject)}
                      type="text"
                      className="input input-bordered pointer-events-none bg-neutral-100 input-sm w-24 col-span-3"
                    />
                  )}

                  <label className="text-sm">Total No. of Units</label>
                </div>
                <div className="flex items-center flex-col w-56">
                  <input
                    defaultValue={`${assessment?.subject.length}`}
                    type="text"
                    className="input input-bordered pointer-events-none bg-neutral-100 input-sm w-24 col-span-3"
                  />
                  <label className="text-sm">Total No. of Subjects</label>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="modal-action">
          <button onClick={handlePrint} className="btn btn-info text-white">
            Print
          </button>
          <button onClick={handleClose} className="btn btn-error text-white">
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}
export default PrintModal;
