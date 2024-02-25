"use client";

import { StatusBadge } from "@components/ui";
import { ColumnDef } from "@tanstack/react-table";
import { Tables } from "types/supabase-helpers";
import DialogModalButton from "./enrollment-modal-button";

type SubjectStatus = Pick<
  Tables<"enrollment_application">,
  "enrollment_application_id" | "status"
>;

type UserInformation = Pick<
  Tables<"user_infomation">,
  "firstname" | "middlename" | "lastname" | "suffix" | "email"
>;

export type EnrollmentApplication = SubjectStatus & {
  user_infomation: UserInformation;
};

export const columns: ColumnDef<EnrollmentApplication>[] = [
  {
    header: "Name",
    accessorFn: (row) =>
      `${row.user_infomation.lastname}, ${row.user_infomation.firstname} ${
        row.user_infomation.middlename != ""
          ? `${row.user_infomation.middlename?.charAt(0)}.`
          : ""
      }`,
  },
  {
    accessorFn: (row) => `${row.user_infomation.email}`,
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status!} />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const enrollmentApplication = row.original;

      return (
        <DialogModalButton
          id={enrollmentApplication.enrollment_application_id}
        />
      );
    },
  },
];
