"use client";

import {
  CheckboxInput,
  ContactNumberInput,
  DateInput,
  SchoolYearSelect,
  SelectInput,
  TextInput,
} from "@components/inputs";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import Image from "next/image";
import { UploadButton } from "utils/uploadthing";
import Link from "next/link";
import { XMark } from "@assets/icons";
import { Tables } from "types/supabase-helpers";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import SubmitButton from "@components/ui/submit-button";

const requiredTextField = z.string().min(1, "This text field is required");
const requiredSelectField = z.string().min(1, "Please select from the options");

const admissionSchema = z.object({
  admitType: requiredSelectField,
  yearLevel: requiredSelectField,
  idNumber: z.string(),
  LRN: z.string(),
  program: requiredSelectField,
});

const studentSchema = z.object({
  firstName: z.string(),
  middleName: z.string(),
  lastName: z.string(),
  suffix: z.string(),
  civilStatus: requiredSelectField,
  gender: requiredSelectField,
  citizenship: requiredTextField,
  birthDate: requiredTextField,
  birthPlace: requiredTextField,
});

const addressSchema = z.object({
  unitNumber: z.string(),
  street: z.string(),
  subdivision: z.string(),
  barangay: requiredTextField,
  city: requiredTextField,
  province: requiredTextField,
  zipCode: requiredTextField,
});

const contactSchema = z.object({
  landline: z.string(),
  mobile: requiredTextField,
  email: requiredTextField,
});

const lastSchoolSchema = z.object({
  schoolType: requiredSelectField,
  schoolName: requiredTextField,
  program: requiredSelectField,
  graduationDate: requiredSelectField,
  schoolYear: requiredSelectField,
  yearLevel: requiredSelectField,
  term: requiredSelectField,
});

const parentSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  middleName: z.string().max(3),
  suffix: z.string(),
  mobile: z.string(),
  email: z.string(),
  occupation: z.string(),
});

const guardianSchema = parentSchema.extend({
  firstName: requiredTextField,
  lastName: requiredTextField,
  middleName: z.string().max(3),
  suffix: z.string(),
  mobile: requiredTextField,
  email: z.string(),
  occupation: z.string(),
  relationship: requiredTextField,
});

const parentsGuardianSchema = z.object({
  father: parentSchema,
  mother: parentSchema,
  guardian: guardianSchema,
});

const surveySchema = z.object({
  tv: z.boolean(),
  radio: z.boolean(),
  print: z.boolean(),
  schoolEvent: z.boolean(),
  flyers: z.boolean(),
  billboards: z.boolean(),
  posters: z.boolean(),
  destination: z.boolean(),
  seminar: z.boolean(),
  camp: z.boolean(),
  website: z.boolean(),
  socialMedia: z.boolean(),
  referrals: z.boolean(),
  others: z.boolean(),
});

const applicationFormSchema = z.object({
  admission: admissionSchema,
  student: studentSchema,
  current: addressSchema,
  permanent: addressSchema,
  contact: contactSchema,
  lastSchool: lastSchoolSchema,
  parentsGuardian: parentsGuardianSchema,
  survey: surveySchema,
  attachment: z.array(z.string()),
});

type ApplicationFormType = z.infer<typeof applicationFormSchema>;

function ApplicationForm({
  userInfo,
}: {
  userInfo: Tables<"user_infomation">;
}) {
  const router = useRouter();
  const [isCurrentAddress, setIsCurrentAddress] = useState<boolean>(false);
  const [attachment, setAttachment] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
    getValues,
    setValue,
  } = useForm<ApplicationFormType>({
    resolver: zodResolver(applicationFormSchema),
  });

  const onSubmit = async (values: ApplicationFormType) => {
    try {
      const response = await fetch("/api/student/enrollment-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          userId: userInfo.user_id,
          attachment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      toast.success(data.message);

      router.replace("/student");
    } catch (error) {
      console.error(`Fetch Error: ${error}`);
      toast.error("Something went wrong");
    }
  };

  const onChangeCopyAddress = (e: ChangeEvent<HTMLInputElement>) => {
    setIsCurrentAddress((prev) => !prev);
    if (e.target.checked) {
      const current = getValues("current");
      setValue("permanent", current);
    } else {
      setValue("permanent.unitNumber", "");
      setValue("permanent.street", "");
      setValue("permanent.subdivision", "");
      setValue("permanent.barangay", "");
      setValue("permanent.city", "");
      setValue("permanent.province", "");
      setValue("permanent.zipCode", "");
    }
  };

  const handleDeleteAttachment = (
    e: React.MouseEvent<HTMLButtonElement>,
    image: string
  ) => {
    e.preventDefault();

    setAttachment(attachment.filter((imageUrl) => imageUrl != image));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="divider card-title mb-0 whitespace-normal text-center text-base xs:whitespace-nowrap">
            Admission Information
          </h3>
          <div className="grid-cols-2 gap-x-2 md:grid">
            <SelectInput
              label="Admission Type"
              name="admission.admitType"
              register={register}
              options={["New Student", "Transferee"]}
              required
              error={errors.admission?.admitType?.message}
            />
            <SelectInput
              label="Year Level"
              name="admission.yearLevel"
              register={register}
              options={[
                "First Year",
                "Second Year",
                "Third Year",
                "Fourth Year",
              ]}
              required
              error={errors.admission?.yearLevel?.message}
            />
            <TextInput
              label="ID Number"
              name="admission.idNumber"
              register={register}
              placeholder="ID Number"
              error={errors.admission?.idNumber?.message}
            />
            <TextInput
              label="LRN"
              name="admission.LRN"
              register={register}
              placeholder="LRN"
              error={errors.admission?.LRN?.message}
            />
          </div>
          <SelectInput
            label="College Programs"
            name="admission.program"
            options={[
              "BS Infomation Technology (BSIT)",
              "BS Computer Science (BSCS)",
              "BS Hospitality Management (BSHM)",
              "BS Tourism Management (BSTM)",
              "BS Accountancy (BSA)",
              "BS Business Administration (BSBA)",
              "BS Accounting Information Systemc(BSAIS)",
              "Bachelor of Arts in Communication (BACOMM)",
              "Bachelor of Multimedia Arts (BMMA)",
              "BS Computer Engineering (BSCpE)",
              "Associate in Computer Technology (ACT)",
              "Hospitality and Resturant Service (HRS)",
            ]}
            register={register}
            required
            error={errors.admission?.program?.message}
          />
        </div>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="divider card-title whitespace-normal text-center text-base xs:whitespace-nowrap">
            Student Infomation
          </h3>

          <div className="grid-cols-3 gap-x-2  md:grid">
            <TextInput
              label="First Name"
              name="student.firstName"
              placeholder="Given Name"
              register={register}
              uneditable
              required
              defaultValue={userInfo?.firstname || ""}
              error={errors.student?.firstName?.message}
            />
            <TextInput
              label="Middle Name"
              name="student.middleName"
              placeholder="Middle Name"
              uneditable
              register={register}
              defaultValue={userInfo?.middlename || ""}
              error={errors.student?.middleName?.message}
            />
            <TextInput
              label="Last Name"
              name="student.lastName"
              placeholder="Last Name"
              uneditable
              register={register}
              defaultValue={userInfo?.lastname || ""}
              error={errors.student?.lastName?.message}
              required
            />
            <TextInput
              label="Suffix"
              name="student.suffix"
              placeholder="(e.g. Jr.)"
              uneditable
              register={register}
              defaultValue={userInfo?.suffix || ""}
              error={errors.student?.suffix?.message}
            />
            <SelectInput
              label="Civil Status"
              name="student.civilStatus"
              register={register}
              options={["Single", "Marriage"]}
              required
              error={errors.student?.civilStatus?.message}
            />
            <SelectInput
              label="Gender"
              name="student.gender"
              register={register}
              options={["Male", "Female"]}
              required
              error={errors.student?.gender?.message}
            />
            <TextInput
              label="Citizenship"
              name="student.citizenship"
              placeholder="Citizenship"
              register={register}
              required
              error={errors.student?.citizenship?.message}
            />
            <DateInput
              label="Date of Birth"
              name="student.birthDate"
              register={register}
              required
              error={errors.student?.birthDate?.message}
            />
            <TextInput
              label="Birthplace"
              name="student.birthPlace"
              placeholder="Birthplace"
              register={register}
              error={errors.student?.birthPlace?.message}
              required
            />
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="divider card-title whitespace-normal text-center text-base xs:whitespace-nowrap">
            Current Address
          </h3>

          <div className="grid-cols-4 gap-x-2 md:grid">
            <TextInput
              label="House/Lot/Unit No."
              name="current.unitNumber"
              placeholder="House/Lot/Unit No."
              register={register}
              required
              error={errors.current?.unitNumber?.message}
            />
            <TextInput
              label="Street"
              name="current.street"
              placeholder="Street"
              error={errors.current?.street?.message}
              register={register}
              required
            />
            <TextInput
              className="col-span-2"
              label="Subdivision/Village/Building"
              name="current.subdivision"
              placeholder="Subdivision/Village/Building"
              register={register}
              error={errors.current?.unitNumber?.message}
              required
            />
            <TextInput
              label="Barangay"
              name="current.barangay"
              placeholder="Barangay"
              required
              register={register}
              error={errors.current?.barangay?.message}
            />
            <TextInput
              label="City/Municipality"
              name="current.city"
              placeholder="City/Municipality"
              required
              error={errors.current?.barangay?.message}
              register={register}
            />
            <TextInput
              label="Province"
              name="current.province"
              placeholder="Province"
              error={errors.current?.barangay?.message}
              register={register}
              required
            />
            <TextInput
              label="Zip Code"
              name="current.zipCode"
              placeholder="Zip Code"
              register={register}
              required
              error={errors.current?.zipCode?.message}
            />
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="divider card-title whitespace-normal text-center text-base xs:whitespace-nowrap">
            Permanent Address
          </h3>

          <div className="form-control">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                onChange={onChangeCopyAddress}
                type="checkbox"
                className="checkbox-primary checkbox checkbox-sm"
              />
              <span className="text-neutral-500">
                My current address is my permanent address.
              </span>
            </label>
          </div>

          <div className="grid-cols-4 gap-x-2 md:grid">
            <TextInput
              label="House/Lot/Unit No."
              name="permanent.unitNumber"
              placeholder="House/Lot/Unit No."
              register={register}
              disabled={isCurrentAddress}
              error={errors.permanent?.unitNumber?.message}
              required
            />
            <TextInput
              label="Street"
              name="permanent.street"
              placeholder="Street"
              register={register}
              disabled={isCurrentAddress}
              error={errors.permanent?.street?.message}
              required
            />
            <TextInput
              className="col-span-2"
              label="Subdivision/Village/Building"
              name="permanent.subdivision"
              placeholder="Subdivision/Village/Building"
              register={register}
              disabled={isCurrentAddress}
              error={errors.permanent?.subdivision?.message}
              required
            />
            <TextInput
              label="Barangay"
              name="permanent.barangay"
              placeholder="Barangay"
              register={register}
              disabled={isCurrentAddress}
              error={errors.permanent?.barangay?.message}
              required
            />
            <TextInput
              label="City/Municipality"
              name="permanent.city"
              placeholder="City/Municipality"
              register={register}
              error={errors.permanent?.city?.message}
              required
              disabled={isCurrentAddress}
            />
            <TextInput
              label="Province"
              name="permanent.province"
              placeholder="Province"
              register={register}
              required
              disabled={isCurrentAddress}
              error={errors.permanent?.province?.message}
            />
            <TextInput
              label="Zip Code"
              name="permanent.zipCode"
              placeholder="Zip Code"
              register={register}
              disabled={isCurrentAddress}
              error={errors.permanent?.zipCode?.message}
              required
            />
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="divider card-title whitespace-normal text-center text-base xs:whitespace-nowrap">
            Contact Details
          </h3>

          <div className="grid-cols-3 gap-x-2 md:grid">
            <TextInput
              type="number"
              label="Landline"
              name="contact.landline"
              placeholder="(e.g. 046 123-4567)"
              register={register}
              error={errors.contact?.landline?.message}
            />

            <ContactNumberInput
              label="Mobile"
              name="contact.mobile"
              placeholder="e.g. 0917 123-4567"
              control={control}
              defaultValue={userInfo.contact}
              error={errors.contact?.mobile?.message}
              disabled
              required
            />
            <TextInput
              label="Email"
              name="contact.email"
              placeholder="Email"
              register={register}
              error={errors.contact?.email?.message}
              defaultValue={userInfo?.email || ""}
              uneditable
              required
            />
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="divider card-title whitespace-normal text-center text-base xs:whitespace-nowrap">
            Last School Attended
          </h3>

          <div className="grid-cols-3 gap-x-2 md:grid">
            <SelectInput
              label="School Type"
              name="lastSchool.schoolType"
              register={register}
              options={[
                "High School",
                "Junior High School",
                "Senior High School",
                "College",
                "ALS A&E/PEPT***",
              ]}
              required
              error={errors.lastSchool?.schoolType?.message}
            />
            <TextInput
              className="col-span-2"
              label="Name of School"
              name="lastSchool.schoolName"
              placeholder="Name of School"
              register={register}
              defaultValue={userInfo.last_school || ""}
              uneditable
              required
              error={errors.lastSchool?.schoolName?.message}
            />
            <TextInput
              className="col-span-2"
              label="Program/Track & Strand/Specialization"
              name="lastSchool.program"
              placeholder="Program/Track & Strand/Specialization"
              register={register}
              required
              error={errors.lastSchool?.program?.message}
            />
            <DateInput
              label="Date of Graduation"
              name="lastSchool.graduationDate"
              register={register}
              required
              error={errors.lastSchool?.graduationDate?.message}
            />
            <SchoolYearSelect
              label="School Year"
              name="lastSchool.schoolYear"
              register={register}
              required
              error={errors.lastSchool?.schoolYear?.message}
            />
            <SelectInput
              label="Year/Grade"
              name="lastSchool.yearLevel"
              options={[
                "Grade 10",
                "Grade 11",
                "Grade 12",
                "Fourth Year High School",
                "First Year College",
                "Second Year College",
                "Third Year College",
                "Fourth Year College",
                "ALS",
              ]}
              register={register}
              required
              error={errors.lastSchool?.yearLevel?.message}
            />
            <SelectInput
              label="Term"
              name="lastSchool.term"
              options={["First Term", "Second Term", "Third Term", "Summer"]}
              register={register}
              required
              error={errors.lastSchool?.term?.message}
            />
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="divider card-title whitespace-normal text-center text-base xs:whitespace-nowrap">
            Parents/Guardian{"'"}s Information
          </h3>

          <div className="grid grid-rows-1">
            <div className="grid-cols-6 gap-x-2 md:grid">
              <label className="label col-span-6">
                <span className="label-text font-semibold">
                  Father{"'"}s Information
                </span>
              </label>
              <TextInput
                className="col-span-2"
                label="First Name"
                name="parentsGuardian.father.firstName"
                placeholder="Given Name"
                register={register}
                error={errors.parentsGuardian?.father?.firstName?.message}
              />
              <TextInput
                className="col-span-2"
                label="Last Name"
                name="parentsGuardian.father.lastName"
                placeholder="Last Name"
                error={errors.parentsGuardian?.father?.lastName?.message}
                register={register}
              />
              <TextInput
                label="Middle Initial"
                name="parentsGuardian.father.middleName"
                placeholder="Middle Initial"
                error={errors.parentsGuardian?.father?.middleName?.message}
                register={register}
              />
              <TextInput
                label="Suffix"
                name="parentsGuardian.father.suffix"
                placeholder="(e.g. Jr.)"
                error={errors.parentsGuardian?.father?.suffix?.message}
                register={register}
              />
              <ContactNumberInput
                className="col-span-2"
                label="Father Mobile"
                name="parentsGuardian.father.mobile"
                placeholder="e.g. 0917 123-4567"
                error={errors.parentsGuardian?.father?.mobile?.message}
                control={control}
              />
              <TextInput
                className="col-span-2"
                label="Email"
                name="parentsGuardian.father.email"
                placeholder="Email"
                error={errors.parentsGuardian?.father?.email?.message}
                register={register}
              />
              <TextInput
                className="col-span-2"
                label="Occupation"
                name="parentsGuardian.father.occupation"
                placeholder="Occupation"
                error={errors.parentsGuardian?.father?.occupation?.message}
                register={register}
              />
            </div>
            <div className="mt-5 grid-cols-6 gap-x-2 md:grid">
              <label className="label col-span-6">
                <span className="label-text font-semibold">
                  Mother{"'"}s Information
                </span>
              </label>
              <TextInput
                className="col-span-2"
                label="First Name"
                name="parentsGuardian.mother.firstName"
                placeholder="Given Name"
                register={register}
                error={errors.parentsGuardian?.mother?.firstName?.message}
              />
              <TextInput
                className="col-span-2"
                label="Last Name"
                name="parentsGuardian.mother.lastName"
                placeholder="Last Name"
                register={register}
                error={errors.parentsGuardian?.mother?.lastName?.message}
              />
              <TextInput
                label="Middle Initial"
                name="parentsGuardian.mother.middleName"
                placeholder="Middle Initial"
                register={register}
                error={errors.parentsGuardian?.mother?.middleName?.message}
              />
              <TextInput
                label="Suffix"
                name="parentsGuardian.mother.suffix"
                placeholder="(e.g. Jr.)"
                register={register}
                error={errors.parentsGuardian?.mother?.suffix?.message}
              />
              <ContactNumberInput
                className="col-span-2"
                label="Mother Mobile"
                name="parentsGuardian.mother.mobile"
                placeholder="e.g. 0917 123-4567"
                control={control}
                error={errors.parentsGuardian?.mother?.mobile?.message}
              />
              <TextInput
                className="col-span-2"
                label="Email"
                name="parentsGuardian.mother.email"
                placeholder="Email"
                register={register}
                error={errors.parentsGuardian?.mother?.email?.message}
              />
              <TextInput
                className="col-span-2"
                label="Occupation"
                name="parentsGuardian.mother.occupation"
                placeholder="Occupation"
                register={register}
                error={errors.parentsGuardian?.mother?.occupation?.message}
              />
            </div>

            <div className="mt-5 grid-cols-8 gap-x-2 md:grid">
              <label className="label col-span-8">
                <span className="label-text font-semibold">
                  Guardian{"'"}s Information
                </span>
              </label>
              <TextInput
                className="col-span-3"
                label="First Name"
                name="parentsGuardian.guardian.firstName"
                placeholder="Given Name"
                register={register}
                required
                error={errors.parentsGuardian?.guardian?.firstName?.message}
              />
              <TextInput
                className="col-span-3"
                label="Last Name"
                name="parentsGuardian.guardian.lastName"
                placeholder="Last Name"
                register={register}
                required
                error={errors.parentsGuardian?.guardian?.lastName?.message}
              />
              <TextInput
                label="M.I"
                name="parentsGuardian.guardian.middleName"
                placeholder="Middle Initial"
                register={register}
                error={errors.parentsGuardian?.guardian?.middleName?.message}
              />
              <TextInput
                label="Suffix"
                name="parentsGuardian.guardian.suffix"
                placeholder="(e.g. Jr.)"
                error={errors.parentsGuardian?.guardian?.suffix?.message}
                register={register}
              />
              <ContactNumberInput
                className="col-span-2"
                label="Guardian's Mobile"
                name="parentsGuardian.guardian.mobile"
                placeholder="e.g. 0917 123-4567"
                control={control}
                required
                error={errors.parentsGuardian?.guardian?.mobile?.message}
              />
              <TextInput
                className="col-span-2"
                label="Email"
                name="parentsGuardian.guardian.email"
                placeholder="Email"
                error={errors.parentsGuardian?.guardian?.email?.message}
                register={register}
              />
              <TextInput
                className="col-span-2"
                label="Occupation"
                name="parentsGuardian.guardian.occupation"
                placeholder="Occupation"
                error={errors.parentsGuardian?.guardian?.occupation?.message}
                register={register}
              />
              <TextInput
                className="col-span-2"
                label="Relationship"
                name="parentsGuardian.guardian.relationship"
                placeholder="Relationship"
                register={register}
                required
                error={errors.parentsGuardian?.guardian?.relationship?.message}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="divider card-title whitespace-normal text-center text-base xs:whitespace-nowrap">
            Upload attachment
          </h2>
          <div className="grid w-full place-items-center">
            <div className="flex justify-center gap-2">
              {attachment.length > 0 &&
                attachment.map((image) => (
                  <div key={image} className="relative">
                    <Link href={image} target="_blank">
                      <Image
                        className="w-20 h-20 object-cover"
                        width={50}
                        height={50}
                        alt={image}
                        src={image}
                      />
                    </Link>
                    <button
                      onClick={(e) => handleDeleteAttachment(e, image)}
                      className="absolute top-0 right-0 bg-accent text-white rounded-full p-1"
                    >
                      <XMark className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
            <p className="m-4">Upload your attachment here.</p>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res) {
                  setAttachment([
                    ...attachment,
                    ...res.map((image) => image.url),
                  ]);
                  setValue("attachment", attachment);
                }
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
              }}
            />
          </div>
          <div className="flex grid-cols-3 flex-col gap-4 p-4 md:grid">
            <div>
              <h3 className="font-semibold">
                Alternative Learning System (ALS) Passers
              </h3>
              <ul className="ml-5 list-disc">
                <li>
                  Original Form 138/SF9-SHS (Learnes Progress Report Card)
                </li>
                <li>
                  Original Form 137/SF10-SHS (Learners Permanent Academic
                  Record)
                </li>
                <li>NSO/PSA-issued Birth Certificate</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">College Freshmen</h3>
              <ul className="ml-5 list-disc">
                <li>Certificate of Transfer (Honorable Dismissal)</li>
                <li>Official Transcript of Records</li>
                <li>NSO/PSA-issued Birth Certificate</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">College Transferees</h3>
              <ul className="ml-5 list-disc">
                <li>
                  Certificate of Rating (COR) indicating SHS & College
                  eligibility
                </li>
                <li>NSO/PSA-issued Birth Certificate</li>
                <li>
                  Any of the following clearances: Barangay, Police, or NBI
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="divider card-title whitespace-normal text-center text-base xs:whitespace-nowrap">
            Survey
          </h2>
          <label className="label">
            <span className="label-text font-semibold">
              How did you find out about STI?
              <span className={"text-accent"}> *</span>
            </span>
          </label>
          <div className="flex flex-col gap-2">
            <CheckboxInput label="TV" name="survey.tv" register={register} />
            <CheckboxInput
              label="Radio"
              name="survey.radio"
              register={register}
            />
            <CheckboxInput
              label="Print"
              name="survey.print"
              register={register}
            />
            <CheckboxInput
              label="School-led event"
              name="survey.schoolEvent"
              register={register}
            />
            <CheckboxInput
              label="Flyers/Leaflets"
              name="survey.flyers"
              register={register}
            />
            <CheckboxInput
              label="Billboards/Banner"
              name="survey.billboards"
              register={register}
            />
            <CheckboxInput
              label="Posters"
              name="survey.posters"
              register={register}
            />
            <CheckboxInput
              label="Destination/STIMULI Magazine/Organizer"
              name="survey.destination"
              register={register}
            />
            <CheckboxInput
              label="Career Orientation Seminar"
              name="survey.seminar"
              register={register}
            />
            <CheckboxInput
              label="Career Camp"
              name="survey.camp"
              register={register}
            />
            <CheckboxInput
              label="STI Website"
              name="survey.website"
              register={register}
            />
            <CheckboxInput
              label="Social Media"
              name="survey.socialMedia"
              register={register}
            />
            <CheckboxInput
              label="Referrals"
              name="survey.referrals"
              register={register}
            />
            <CheckboxInput
              label="Others"
              name="survey.others"
              register={register}
            />
          </div>
        </div>
      </div>
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body flex flex-row justify-between">
          <label className="flex items-center gap-3">
            <input
              required
              type="checkbox"
              className="checkbox-primary checkbox checkbox-sm"
            />{" "}
            <span>
              I agree to the{" "}
              <Link
                href={"/student/terms-and-conditions"}
                target="_blank"
                className=" text-primary underline"
              >
                terms & conditions
              </Link>
            </span>
          </label>
          <SubmitButton isSubmitting={isSubmitting} />
        </div>
      </div>
    </form>
  );
}

export default ApplicationForm;
