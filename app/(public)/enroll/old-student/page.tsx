import { SingUp } from "@assets/illustrations";
import OldStudentForm from "./old-student-form";

export default function OldStudent() {
  return (
    <div className="container mx-auto flex flex-row-reverse items-center justify-center gap-24 p-4">
      <div className="hidden max-w-lg lg:block">
        <SingUp className="w-full max-w-md drop-shadow-2xl" />
      </div>
      <OldStudentForm />
    </div>
  );
}
