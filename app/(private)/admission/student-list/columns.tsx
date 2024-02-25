"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Tables } from "types/supabase-helpers";
import DialogModalButton from "./student-list-modal-button";

export type Student = Tables<"user_infomation">;

export const columns: ColumnDef<Student>[] = [
  {
    header: "Name",
    accessorFn: (row) =>
      `${row.lastname}, ${row.firstname} ${
        row.middlename != "" ? `${row.middlename?.charAt(0)}.` : ""
      }`,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "contact",
    header: "Contact",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <DialogModalButton id={row.original.user_id} />;
    },
  },
];
