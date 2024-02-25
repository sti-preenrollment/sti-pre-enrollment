import { NotFoundIllus } from "@assets/illustrations";
import Link from "next/link";

function NotFound() {
  return (
    <div className="grid place-items-center text-center">
      <NotFoundIllus className="w-[30rem]" />
      <p className="whitespace-break-spaces">
        The page you are attempting to access cannot be found, or you do not
        have permission to view it.
        <Link href="/" className="text-blue-700 underline block">
          Go to Home
        </Link>
      </p>
    </div>
  );
}
export default NotFound;
