"use client";

import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Navigations({
  navigations,
}: {
  navigations: { path: string; icon: JSX.Element; title: string }[];
}) {
  const pathname = usePathname();

  return (
    <>
      {navigations.map((navigation) => (
        <Link href={navigation.path} key={navigation.path}>
          <div
            className={classNames(
              "flex cursor-pointer items-center gap-5 py-4 pl-6 transition-all hover:bg-[#060F39] active:scale-95",
              {
                "bg-[#0F144B] hover:bg-[#0F144B]": pathname === navigation.path,
              }
            )}
          >
            {navigation.icon}

            <span className="text-base font-semibold capitalize">
              {navigation.title}
            </span>
          </div>
        </Link>
      ))}
    </>
  );
}
export default Navigations;
