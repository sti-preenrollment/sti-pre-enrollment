"use client";

import { useCreateQueryString } from "@hooks/useCreateQueryString";
import classNames from "classnames";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function Tabs() {
  const searchParams = useSearchParams()!;
  const tab = searchParams.get("tab") || "all";
  const createQueryString = useCreateQueryString();

  return (
    <div className="tabs tabs-lifted">
      <Link
        href={"?" + createQueryString("tab", "all")}
        className={classNames("tab  tab-lifted", {
          "tab-active": tab === "all",
        })}
      >
        All Application
      </Link>
      <Link
        href={"?" + createQueryString("tab", "pending")}
        className={classNames("tab tab-lifted", {
          "tab-active": tab === "pending",
        })}
      >
        Pending
      </Link>
      <Link
        href={"?" + createQueryString("tab", "approved")}
        className={classNames("tab tab-lifted", {
          "tab-active": tab === "approved",
        })}
      >
        Approved
      </Link>
      <Link
        href={"?" + createQueryString("tab", "rejected")}
        className={classNames("tab tab-lifted", {
          "tab-active": tab === "rejected",
        })}
      >
        Rejected
      </Link>
    </div>
  );
}
export default Tabs;
