import { SingUp } from "@assets/illustrations";
import NewStudentForm from "./new-student-form";

export default function NewStudent() {
  return (
    <div className="container mx-auto flex items-center justify-center gap-24 p-4">
      <div className="hidden max-w-lg lg:block">
        <SingUp className="w-full max-w-md drop-shadow-2xl" />
      </div>
      <NewStudentForm />
    </div>
  );
}
