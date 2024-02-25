import { Home, Calendar } from "@assets/icons";
import Link from "next/link";

const navigation = [
  {
    path: "/student",
    icon: <Home className="w-7 h-7" />,
  },
  {
    path: "/student/schedules",
    icon: <Calendar className="w-7 h-7" />,
  },
];

function OldStudentNav() {
  return (
    <div className="card bg-base-100 shadow-lg max-w-xl mx-auto mb-3">
      <div className="card-body p-3 flex flex-row justify-around">
        {navigation.map((navigation) => (
          <Link
            href={navigation.path}
            key={navigation.path}
            className="btn sm:w-full w-max sm:max-w-[8rem] btn-ghost text-neutral-500"
          >
            {navigation.icon}
          </Link>
        ))}
      </div>
    </div>
  );
}
export default OldStudentNav;
