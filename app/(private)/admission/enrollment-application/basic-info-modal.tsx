"use client";

import { DisabledTextInput, LoadingComponent } from "@components/ui";
import { modalAction } from "@helper/modalAction";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Tables } from "types/supabase-helpers";
import supabase from "utils/supabase";

function BasicInfoModal() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [userInfo, setUserInfo] = useState<Tables<"user_infomation"> | null>(
    null
  );
  const printBasicInfoRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printBasicInfoRef.current,
  });

  useEffect(() => {
    if (!id) return;

    (async () => {
      const { data: userInfo } = await supabase
        .from("user_infomation")
        .select()
        .eq("user_id", id!)
        .single();

      setUserInfo(userInfo);
    })();
  }, [id]);

  const handleClose = () => {
    modalAction("basic_info_modal", "close");
    modalAction("modal_1", "open");
  };

  return (
    <dialog id="basic_info_modal" className="modal">
      <div className="modal-box max-w-2xl">
        <div ref={printBasicInfoRef} className="p-4">
          <h3 className="font-bold text-lg">Student Information</h3>
          <div className="divider divider-primary mb-0"></div>
          {!userInfo ? (
            <div className="flex justify-center">
              <LoadingComponent size="md" />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 my-3">
              <DisabledTextInput
                label="First Name"
                value={`${userInfo.firstname}`}
              />
              <DisabledTextInput
                label="Middle Name"
                value={`${userInfo.middlename}`}
              />
              <DisabledTextInput
                label="Last Name"
                value={`${userInfo?.lastname}`}
              />
              <DisabledTextInput label="Suffix" value={`${userInfo.suffix}`} />
              <DisabledTextInput
                label="Contact No."
                value={`${userInfo.contact}`}
              />
              <DisabledTextInput label="Email" value={`${userInfo.email}`} />
              <div className="col-span-3">
                <DisabledTextInput
                  label="Last School"
                  value={`${userInfo.last_school}`}
                />
              </div>
            </div>
          )}
        </div>
        <div className="modal-action ">
          <button onClick={handleClose} className="btn btn-error text-white">
            Close
          </button>
          <button onClick={handlePrint} className="btn btn-info text-white">
            Print
          </button>
        </div>
      </div>
    </dialog>
  );
}
export default BasicInfoModal;
