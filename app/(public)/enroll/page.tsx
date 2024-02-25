import { Student } from "@assets/illustrations";
import Link from "next/link";

export default function Enroll() {
  return (
    <div className="container mx-auto flex items-center justify-center gap-24 px-2">
      <div className="hidden max-w-xl overflow-hidden lg:block">
        <Student className="w-[30rem]" />
      </div>
      <div className="card h-fit w-full max-w-md border-t-4 border-primary bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">What type of student are you?</h2>
          <p>Please make a selection from the options below:</p>

          <Link
            role="button"
            href={"/enroll/new-student"}
            className="btn border-2 border-primary bg-transparent text-primary hover:scale-105 hover:border-primary hover:bg-transparent"
          >
            New Student
          </Link>

          <Link
            role="button"
            href={"/enroll/old-student"}
            className="btn border-2 border-primary bg-transparent text-primary hover:scale-105 hover:border-primary hover:bg-transparent"
          >
            Existing STI Student
          </Link>
        </div>
      </div>
    </div>
  );
}
