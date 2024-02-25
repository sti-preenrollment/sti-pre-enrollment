import Link from "next/link";

function TermsAndConditions() {
  return (
    <div className="card bg-base-100 shadow-lg max-w-3xl mx-auto ">
      <div className="card-body space-y-5 text-justify">
        <h2 className="card-title">Terms & Conditions</h2>
        <div>
          <h3 className="font-semibold">Admission & Enrollment</h3>
          <p>
            A student is deemed officially enrolled after he/she has submitted
            the appropriate admission or transfer credentials, and paid the
            required down payment in full or the amount due as stated on the
            Registration and Assessment Form. Registration fee is
            non-refundable.
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Data Privacy</h3>
          <p>
            STI recognizes the fundamental right of all individuals to the
            privacy of his/her personal information. STI commits to the
            responsible and lawful treatment of personal information about the
            student including but not limited to his/her grades, exam results,
            parents and guardian{"'"} details, and medical condition. STI shall
            process and share personal information of the student in accordance
            with the Republic Act (RA) No. 10173 or the Data Privacy Act of
            2012.
          </p>
          <p>
            Visit{" "}
            <Link
              className="link link-hover"
              href={"https://www.sti.edu/dataprivacy"}
            >
              https://www.sti.edu/dataprivacy
            </Link>{" "}
            to learn more about the STI Data Privacy Policy.
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Fitness</h3>
          <p>
            Before being admitted to this institution, an applicant must satisfy
            the criteria including suitability in respect of health. It is the
            applicant{"'"}s responsibility to declare his/her suitability, to
            the best of his/her knowledge regarding health status. The applicant
            must list any medical and/or psychological condition that should be
            taken into consideration in the course of his/her studies and
            participation in various school activities in the box below.
          </p>
        </div>
        <div>
          <h3 className="font-semibold">
            Republic Act (RA) No. 9165 (Comprehensive Dangerous Drugs Act of
            2002)
          </h3>
          <p>
            STI is compliant to the Republic Act (RA) No. 9165 (Comprehensive
            Dangerous Drugs Act of 2002). Any student may be randomly selected
            and subjected to drug testing, as prescribed by and in accordance
            with the law, at any time and place relative to the academic and
            extra-curricular activities upon the decision of the school
            administration.
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Undertaking</h3>
          <p>
            I hereby declare that the information I have provided is true,
            correct, and complete to the best of my knowledge. I fully
            understand that if I have provided any false information, such may
            be the basis for the denial of my admission or my non-readmission or
            exclusion from STI if already admitted. I, likewise, have read and
            understood the terms and conditions herein provided and agree to the
            same. I, further, declare that I am consenting to the collection,
            use, processing, and sharing of my personal data, pursuant to the
            Republic Act No. 10173 or the Data Privacy Act of 2012, for any
            purpose relative to my enrollment with STI, including but not
            limited to: (1) the evaluation of my application, and (2) the
            recording, storing, maintaining, analyzing, assessing, and sharing
            thereof with third parties (for academic, co-curricular, and
            extra-curricular purposes) on the STI School Management System or
            any other similar information systems, directories, and alumni
            records (in connection with possible related placement activities).
            I am fully aware that this personal information I have provided
            shall be retained for as long as necessary as determined by STI.
          </p>
        </div>
      </div>
    </div>
  );
}
export default TermsAndConditions;
