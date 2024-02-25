"use client";

import { StatusBadge } from "@components/ui";
import { ColumnDef } from "@tanstack/react-table";
import { Tables } from "types/supabase-helpers";
import DialogModalButton from "./assessment-modal-button";

type SubjectStatus = Pick<
  Tables<"subject_assessment">,
  "subject_assessment_id" | "status" | "print_status"
>;

type UserInformation = Pick<
  Tables<"user_infomation">,
  "firstname" | "middlename" | "lastname" | "suffix" | "email"
>;

export type SubjectAssessment = SubjectStatus & {
  user_infomation: UserInformation;
};

export const columns: ColumnDef<SubjectAssessment>[] = [
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
    accessorKey: "print_status",
    header: "Print Status",
    cell: ({ row }) => <StatusBadge status={row.original.print_status!} />,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DialogModalButton id={row.original.subject_assessment_id} />
    ),
  },
];
