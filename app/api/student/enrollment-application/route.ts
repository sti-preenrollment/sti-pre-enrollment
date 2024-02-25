import { NextRequest, NextResponse } from "next/server";
import supabase from "utils/supabase";
import { z } from "zod";

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
  zipCode: z.string(),
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
  userId: z.string(),
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

export async function POST(req: Request) {
  const body: unknown = await req.json();
  const validation = applicationFormSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ message: "Validation failed" }, { status: 401 });
  }

  const {
    student,
    userId,
    admission,
    contact,
    current,
    lastSchool,
    parentsGuardian: { father, guardian, mother },
    permanent,
    survey,
    attachment,
  } = validation.data;

  const { data: userExist } = await supabase
    .from("user")
    .select()
    .eq("id", userId)
    .single();

  if (!userExist) {
    return NextResponse.json({ message: "User not found" }, { status: 401 });
  }

  const { data: enrollmentAppExist } = await supabase
    .from("enrollment_application")
    .select()
    .eq("enrollment_application_id", userId)
    .single();

  if (enrollmentAppExist) {
    await supabase
      .from("enrollment_application")
      .delete()
      .eq("enrollment_application_id", userId);
  }

  try {
    const { error: newEnrollmentApplicationError } = await supabase
      .from("enrollment_application")
      .insert({
        enrollment_application_id: userId,
        admission_type: admission.admitType,
        attachment,
        id_number: admission.idNumber,
        lrn: admission.LRN,
        program: admission.program,
        year_level: admission.yearLevel,
      });

    const { error: newStudentInformationError } = await supabase
      .from("student_information")
      .insert({
        student_info_id: userId,
        birth_date: student.birthDate,
        birth_place: student.birthPlace,
        citizenship: student.citizenship,
        civil_status: student.civilStatus,
        firstname: student.firstName,
        lastname: student.lastName,
        middlename: student.middleName,
        suffix: student.suffix,
        gender: student.gender,
      });

    const { error: newAddressError } = await supabase.from("address").insert([
      {
        address_type: "current",
        barangay: current.barangay,
        city: current.city,
        enrollment_application_id: userId,
        province: current.province,
        street: current.street,
        subdivision: current.subdivision,
        unit_number: current.unitNumber,
        zip: current.zipCode,
      },
      {
        address_type: "permanent",
        barangay: permanent.barangay,
        city: permanent.city,
        enrollment_application_id: userId,
        province: permanent.province,
        street: permanent.street,
        subdivision: permanent.subdivision,
        unit_number: permanent.unitNumber,
        zip: permanent.zipCode,
      },
    ]);

    const { error: newContactError } = await supabase.from("contact").insert({
      contact_id: userId,
      email: contact.email,
      landline: contact.landline,
      mobile: contact.mobile,
    });

    const { error: newLastSchoolError } = await supabase
      .from("last_school")
      .insert({
        last_school_id: userId,
        graduate_date: lastSchool.graduationDate,
        level: lastSchool.yearLevel,
        name: lastSchool.schoolName,
        program: lastSchool.program,
        term: lastSchool.term,
        type: lastSchool.schoolType,
        year: lastSchool.schoolYear,
      });

    const { error: newParentError } = await supabase.from("parent").insert([
      {
        role: "parent",
        enrollment_application_id: userId,
        email: father.email,
        firstname: father.firstName,
        lastname: father.lastName,
        middlename: father.middleName,
        mobile: father.mobile,
        occupation: father.occupation,
        relation: "father",
        suffix: father.suffix,
      },
      {
        role: "parent",
        enrollment_application_id: userId,
        email: mother.email,
        firstname: mother.firstName,
        lastname: mother.lastName,
        middlename: mother.middleName,
        mobile: mother.mobile,
        occupation: mother.occupation,
        relation: "mother",
        suffix: mother.suffix,
      },
      {
        role: "guardian",
        enrollment_application_id: userId,
        email: guardian.email,
        firstname: guardian.firstName,
        lastname: guardian.lastName,
        middlename: guardian.middleName,
        mobile: guardian.mobile,
        occupation: guardian.occupation,
        relation: guardian.relationship,
        suffix: guardian.suffix,
      },
    ]);

    const { error: newSurveyError } = await supabase.from("survey").insert({
      survey_id: userId,
      billboards: survey.billboards,
      camp: survey.camp,
      destination: survey.destination,
      flyers: survey.flyers,
      others: survey.others,
      posters: survey.posters,
      print: survey.print,
      radio: survey.radio,
      referrals: survey.referrals,
      school_event: survey.schoolEvent,
      seminar: survey.seminar,
      social_media: survey.socialMedia,
      tv: survey.tv,
      website: survey.website,
    });

    if (
      newEnrollmentApplicationError ||
      newAddressError ||
      newContactError ||
      newSurveyError ||
      newParentError ||
      newLastSchoolError ||
      newStudentInformationError
    ) {
      await supabase
        .from("enrollment_application")
        .delete()
        .eq("enrollment_application_id", userId);

      return NextResponse.json(
        {
          message: "Enrollment Application failed.",
          error: {
            newEnrollmentApplicationError,
            newAddressError,
            newContactError,
            newSurveyError,
            newParentError,
            newLastSchoolError,
            newStudentInformationError,
          },
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Student appliation submitted successfully." },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 401 }
    );
  }
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "No id provided" }, { status: 401 });
  }

  try {
    const {
      data: studentEnrollmentApplication,
      error: studentEnrollmentApplicationError,
    } = await supabase
      .from("enrollment_application")
      .select(
        "*, student_information(*), contact(*), parent(*), last_school(*), address(*)"
      )
      .eq("enrollment_application_id", id)
      .single();

    if (studentEnrollmentApplicationError) {
      return NextResponse.json(
        {
          message: "An error occured",
          error: studentEnrollmentApplicationError.message,
        },
        { status: 401 }
      );
    }

    return NextResponse.json(studentEnrollmentApplication, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 401 }
    );
  }
}
