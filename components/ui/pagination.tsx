"use client";

import { useCreateQueryString } from "@hooks/useCreateQueryString";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function Pagination({ remaining, max }: { remaining: number; max: number }) {
  const searchParams = useSearchParams()!;
  const current = Number(searchParams.get("page") || 1);
  const createQueryString = useCreateQueryString();

  return (
    <div className="join w-fit scale-75 self-end bg-neutral-50">
      {current > 1 ? (
        <Link
          scroll={false}
          href={"?" + createQueryString("page", String(current - 1))}
          className="btn join-item"
        >
          «
        </Link>
      ) : (
        <button className="btn join-item" disabled>
          «
        </button>
      )}
      <span className="join-item my-auto px-5">{current}</span>

      {remaining >= max ? (
        <Link
          scroll={false}
          href={"?" + createQueryString("page", String(current + 1))}
          className="btn join-item"
        >
          »
        </Link>
      ) : (
        <button className="btn join-item" disabled>
          »
        </button>
      )}
    </div>
  );
}
export default Pagination;
