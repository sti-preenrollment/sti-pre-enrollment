import { DisabledTextInput } from "@components/ui";
import { authOptions } from "@lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { Tables } from "types/supabase-helpers";
import supabase from "utils/supabase";

export const revalidate = 0;

type StudentEnrollmentForm = Tables<"enrollment_application"> & {
  student_information: Tables<"student_information">;
  contact: Tables<"contact">;
  parent: Tables<"parent">[];
  last_school: Tables<"last_school">;
  address: Tables<"address">[];
};

async function StudentInfoPage() {
  const session = await getServerSession(authOptions);
  const { data } = await supabase
    .from("enrollment_application")
    .select(
      "*, student_information(*), contact(*), parent(*), last_school(*), address(*)"
    )
    .eq("enrollment_application_id", session?.user.id!)
    .single();

  const { data: userInfo } = await supabase
    .from("user_infomation")
    .select()
    .eq("user_id", session?.user.id!)
    .single();

  if (userInfo?.student_type !== "new_student" || !data) {
    return notFound();
  }

  const student = data as unknown as StudentEnrollmentForm;

  if (!student) {
    return <div>No user information</div>;
  }

  return (
    <div className="card bg-base-100 shadow-lg max-w-xl mx-auto">
      <div className="card-body">
        <div className="space-y-6 ">
          <h3 className="divider card-title mb-0 whitespace-normal text-center text-base xs:whitespace-nowrap">
            Admission Information
          </h3>
          <div className="">
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
            <DisabledTextInput
              label="College Programs"
              value={`${student.program}`}
            />
          </div>

          <h3 className="divider card-title whitespace-normal text-center text-base xs:whitespace-nowrap">
            Student Infomation
          </h3>

          <div>
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
              <h3 className="divider card-title whitespace-normal text-center text-base xs:whitespace-nowrap capitalize">
                {address.address_type} Address
              </h3>

              <div>
                <DisabledTextInput
                  label="House/Lot/Unit No."
                  value={`${address.unit_number}`}
                />
                <DisabledTextInput label="Street" value={`${address.street}`} />
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
                <DisabledTextInput label="Zip Code" value={`${address.zip}`} />
              </div>
            </div>
          ))}

          <h3 className="divider card-title whitespace-normal text-center text-base xs:whitespace-nowrap">
            Contact Details
          </h3>

          <div>
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

          <div>
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

          <div className="space-y-5">
            <div>
              <label>
                <span className="label-text font-semibold">
                  Father{"'"}s Information
                </span>
              </label>
              {student.parent
                .filter((parent) => parent.role === "parent")
                .filter((parent) => parent.relation === "father")
                .map((father) => (
                  <div key={`${father.id}`}>
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
            </div>
            <div>
              <label>
                <span className="label-text font-semibold">
                  Mother{"'"}s Information
                </span>
              </label>
              {student.parent
                .filter((parent) => parent.role === "parent")
                .filter((parent) => parent.relation === "mother")
                .map((mother) => (
                  <div key={mother.id}>
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
            </div>

            <div>
              <label>
                <span className="label-text font-semibold">
                  Guardian{"'"}s Information
                </span>
              </label>
              {student.parent
                .filter((parent) => parent.role === "guardian")
                .map((guardian) => (
                  <div key={guardian.id}>
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
        </div>
      </div>
    </div>
  );
}

export default StudentInfoPage;
