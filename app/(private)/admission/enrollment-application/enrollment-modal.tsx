"use client";

import { Photo, XMark } from "@assets/icons";
import { DisabledTextInput, LoadingComponent } from "@components/ui";
import { useCreateQueryString } from "@hooks/useCreateQueryString";
import { useReactToPrint } from "react-to-print";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import { Tables } from "types/supabase-helpers";
import supabase from "utils/supabase";
import { modalAction } from "@helper/modalAction";

type StudentEnrollmentForm = Tables<"enrollment_application"> & {
  student_information: Tables<"student_information">;
  contact: Tables<"contact">;
  parent: Tables<"parent">[];
  last_school: Tables<"last_school">;
  address: Tables<"address">[];
};

function EnrollmentModal() {
  const { data: session } = useSession();
  const router = useRouter();
  const createQueryString = useCreateQueryString();
  const [student, setStudent] = useState<StudentEnrollmentForm | null>(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const enrollmentApplicationRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => enrollmentApplicationRef.current,
  });

  useEffect(() => {
    const abortController = new AbortController();

    const getApplications = async () => {
      if (!id) return;

      try {
        const response = await fetch(
          `/api/student/enrollment-application?id=${id}`,
          { signal: abortController.signal }
        );
        const data = await response.json();

        if (!response.ok) {
          toast.error(data.message);
          return;
        }

        setStudent(data);
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          toast.error("Something went wrong.");
        }
      }
    };

    getApplications();

    return () => {
      abortController.abort();
    };
  }, [id]);

  const handleExit = () => {
    router.push("?" + createQueryString("id", ""));
    setStudent(null);
  };

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("enrollment_application")
        .update({ status: "approved" })
        .eq("enrollment_application_id", id!);

      if (error) {
        toast.error("Action failed");
        console.error(error);
        return;
      }

      await supabase.from("audit_trail").insert({
        action: "approved",
        student: id!,
        performer_id: session?.user.id,
        performer_name: session?.user.name,
      });

      toast.success("Application approved");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setStudent({ ...student!, status: "approved" });
    }
  };

  const handleReject = () => {
    modalAction("reject_modal", "open");
  };

  const handlePrintBasicInfo = () => {
    modalAction("basic_info_modal", "open");
    modalAction("modal_1", "close");
  };

  return (
    <dialog id="modal_1" className="modal p-5">
      <div className="modal-box relative w-full max-w-6xl">
        <form method="dialog" className="absolute right-5">
          <button className="btn btn-sm btn-accent p-2" onClick={handleExit}>
            <XMark className="h-4 w-4 text-white" />
          </button>
        </form>

        <h3 className="font-bold text-lg">Student Applicaton</h3>
        <div className="divider m-1"></div>
        <div className="max-h-[70svh] relative overflow-y-auto min-h-[70svh]">
          {!student ? (
            <div className="text-center absolute inset-0 grid place-items-center">
              <LoadingComponent size="md" />
            </div>
          ) : (
            <>
              <div ref={enrollmentApplicationRef} className="space-y-6 p-10">
                <h3 className="divider card-title mb-0 whitespace-normal text-center text-base xs:whitespace-nowrap">
                  Admission Information
                </h3>
                <div className="grid-cols-4 gap-x-2 grid">
                  <DisabledTextInput
                    label="Admission Type"
                    value={`${student.admission_type}`}
                  />
                  <DisabledTextInput
                    label="Year Level"
                    value={`${student.year_level}`}
                  />
                  <DisabledTextInput
                    label="ID Number"
                    value={`${student.id_number}`}
                  />
                  <DisabledTextInput label="LRN" value={`${student.lrn}`} />
                </div>
                <DisabledTextInput
                  label="College Programs"
                  value={`${student.program}`}
                />

                <h3 className="divider card-title whitespace-normal text-center text-base xs:whitespace-nowrap">
                  Student Infomation
                </h3>

                <div className="grid-cols-3 gap-x-2  grid">
                  <DisabledTextInput
                    label="First Name"
                    value={`${student.student_information.firstname}`}
                  />
                  <DisabledTextInput
                    label="Middle Name"
                    value={`${student.student_information.middlename}`}
                  />
                  <DisabledTextInput
                    label="Last Name"
                    value={`${student.student_information.lastname}`}
                  />
                  <DisabledTextInput
                    label="Suffix"
                    value={`${student.student_information.suffix}`}
                  />
                  <DisabledTextInput
                    label="Civil Status"
                    value={`${student.student_information.civil_status}`}
                  />
                  <DisabledTextInput
                    label="Gender"
                    value={`${student.student_information.gender}`}
                  />
                  <DisabledTextInput
                    label="Citizenship"
                    value={`${student.student_information.citizenship}`}
                  />
                  <DisabledTextInput
                    label="Date of Birth"
                    value={`${student.student_information.birth_date}`}
                  />
                  <DisabledTextInput
                    label="Birthplace"
                    value={`${student.student_information.birth_place}`}
                  />
                </div>

                {student.address.map((address, index) => (
                  <div key={`${address.street}${index}`}>
                    <h3 className="divider card-title whitespace-normal text-center text-base xs:whitespace-nowrap">
                      {address.address_type} Address
                    </h3>

                    <div className="grid-cols-4 gap-x-2 grid">
                      <DisabledTextInput
                        label="House/Lot/Unit No."
                        value={`${address.unit_number}`}
                      />
                      <DisabledTextInput
                        label="Street"
                        value={`${address.street}`}
                      />
                      <DisabledTextInput
                        label="Subdivision/Village/Building"
                        value={`${address.subdivision}`}
                      />
                      <DisabledTextInput
                        label="Barangay"
                        value={`${address.barangay}`}
                      />
                      <DisabledTextInput
                        label="City/Municipality"
                        value={`${address.city}`}
                      />
                      <DisabledTextInput
                        label="Province"
                        value={`${address.province}`}
                      />
                      <DisabledTextInput
                        label="Zip Code"
                        value={`${address.zip}`}
                      />
                    </div>
                  </div>
                ))}

                <h3 className="divider card-title whitespace-normal text-center text-base xs:whitespace-nowrap">
                  Contact Details
                </h3>

                <div className="grid-cols-3 gap-x-2 grid">
                  <DisabledTextInput
                    label="Landline"
                    value={`${student.contact.landline}`}
                  />

                  <DisabledTextInput
                    label="Mobile"
                    value={`${student.contact.mobile}`}
                  />
                  <DisabledTextInput
                    label="Email"
                    value={`${student.contact.email}`}
                  />
                </div>

                <h3 className="divider card-title whitespace-normal text-center text-base xs:whitespace-nowrap">
                  Last School Attended
                </h3>

                <div className="grid-cols-3 gap-x-2 grid">
                  <DisabledTextInput
                    label="School Type"
                    value={`${student.last_school.type}`}
                  />
                  <DisabledTextInput
                    label="Name of School"
                    value={`${student.last_school.name}`}
                  />
                  <DisabledTextInput
                    label="Program/Track & Strand/Specialization"
                    value={`${student.last_school.program}`}
                  />
                  <DisabledTextInput
                    label="Date of Graduation"
                    value={`${student.last_school.graduate_date}`}
                  />
                  <DisabledTextInput
                    label="School Year"
                    value={`${student.last_school.year}`}
                  />
                  <DisabledTextInput
                    label="Year/Grade"
                    value={`${student.last_school.year}`}
                  />
                  <DisabledTextInput
                    label="Term"
                    value={`${student.last_school.term}`}
                  />
                </div>

                <h3 className="divider card-title whitespace-normal text-center text-base xs:whitespace-nowrap">
                  Parents/Guardian{"'"}s Information
                </h3>

                <div className="grid grid-rows-1">
                  <label className="label col-span-6">
                    <span className="label-text font-semibold">
                      Father{"'"}s Information
                    </span>
                  </label>
                  {student.parent
                    .filter((parent) => parent.role === "parent")
                    .filter((parent) => parent.relation === "father")
                    .map((father, index) => (
                      <div
                        key={`${father.lastname}${index}`}
                        className="grid grid-cols-4 gap-4"
                      >
                        <DisabledTextInput
                          label="First Name"
                          value={`${father.firstname}`}
                        />
                        <DisabledTextInput
                          label="Last Name"
                          value={`${father.lastname}`}
                        />
                        <DisabledTextInput
                          label="Middle Initial"
                          value={`${father.middlename}`}
                        />
                        <DisabledTextInput
                          label="Suffix"
                          value={`${father.suffix}`}
                        />
                        <DisabledTextInput
                          label="Mobile Number"
                          value={`${father.mobile}`}
                        />
                        <DisabledTextInput
                          label="Email"
                          value={`${father.email}`}
                        />
                        <DisabledTextInput
                          label="Occupation"
                          value={`${father.occupation}`}
                          className="col-span-2"
                        />
                      </div>
                    ))}

                  <label className="label col-span-6">
                    <span className="label-text font-semibold">
                      Mother{"'"}s Information
                    </span>
                  </label>
                  {student.parent
                    .filter((parent) => parent.role === "parent")
                    .filter((parent) => parent.relation === "mother")
                    .map((mother, index) => (
                      <div
                        key={mother.firstname + "" + index + 323}
                        className="grid grid-cols-4 gap-4"
                      >
                        <DisabledTextInput
                          label="First Name"
                          value={`${mother.firstname}`}
                        />
                        <DisabledTextInput
                          label="Last Name"
                          value={`${mother.lastname}`}
                        />
                        <DisabledTextInput
                          label="Middle Initial"
                          value={`${mother.middlename}`}
                        />
                        <DisabledTextInput
                          label="Suffix"
                          value={`${mother.suffix}`}
                        />
                        <DisabledTextInput
                          label="Mobile Number"
                          value={`${mother.mobile}`}
                        />
                        <DisabledTextInput
                          label="Email"
                          value={`${mother.email}`}
                        />
                        <DisabledTextInput
                          label="Occupation"
                          value={`${mother.occupation}`}
                          className="col-span-2"
                        />
                      </div>
                    ))}

                  <label className="label col-span-6">
                    <span className="label-text font-semibold">
                      Guardian{"'"}s Information
                    </span>
                  </label>
                  {student.parent
                    .filter((parent) => parent.role === "guardian")
                    .map((guardian, index) => (
                      <div
                        key={guardian.firstname + "" + index + 3243666}
                        className="grid grid-cols-4 gap-4"
                      >
                        <DisabledTextInput
                          label="First Name"
                          value={`${guardian.firstname}`}
                        />
                        <DisabledTextInput
                          label="Last Name"
                          value={`${guardian.lastname}`}
                        />
                        <DisabledTextInput
                          label="Middle Initial"
                          value={`${guardian.middlename}`}
                        />
                        <DisabledTextInput
                          label="Suffix"
                          value={`${guardian.suffix}`}
                        />
                        <DisabledTextInput
                          label="Mobile Number"
                          value={`${guardian.mobile}`}
                        />
                        <DisabledTextInput
                          label="Email"
                          value={`${guardian.email}`}
                        />
                        <DisabledTextInput
                          label="Occupation"
                          value={`${guardian.occupation}`}
                        />
                        <DisabledTextInput
                          label="Occupation"
                          value={`${guardian.relation}`}
                        />
                      </div>
                    ))}
                </div>
              </div>

              <h2 className="card-title">Attachments</h2>
              <div className="flex flex-row gap-2">
                {student.attachment?.map((image) => (
                  <Link
                    href={image}
                    target="_blank"
                    key={image}
                    className="w-max p-2 rounded-lg border-2"
                  >
                    <Photo className="w-20 h-20 text-primary" />
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
        {student && (
          <div className="modal-action">
            {student?.status === "pending" ? (
              <>
                <button
                  disabled={isLoading}
                  onClick={handleReject}
                  className="btn btn-error text-white capitalize"
                >
                  reject
                </button>
                <button
                  disabled={isLoading}
                  onClick={handleApprove}
                  className="btn btn-success text-white capitalize"
                >
                  approve
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handlePrintBasicInfo}
                  className="btn bg-sky-600 text-white hover:bg-sky-700"
                >
                  Show Basic Info
                </button>
                <button
                  onClick={handlePrint}
                  className="btn btn-info text-white"
                >
                  Print Application Form
                </button>
              </>
            )}
          </div>
        )}
      </div>
      <Toaster expand={true} richColors />
    </dialog>
  );
}
export default EnrollmentModal;
