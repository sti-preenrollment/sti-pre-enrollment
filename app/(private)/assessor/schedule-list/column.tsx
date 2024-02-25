"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Tables } from "types/supabase-helpers";
import SheduleListDropdown from "./schedule-list-dropdown";

export const columns: ColumnDef<Tables<"subject">>[] = [
  {
    accessorKey: "subject_code",
    header: "Code",
  },
  {
    accessorKey: "subject_name",
    header: "Name",
  },
  {
    accessorKey: "instructor",
    header: "Instructor",
  },
  {
    accessorKey: "year_level",
    header: "Year",
  },
  {
    accessorKey: "section",
    header: "Section",
  },
  {
    accessorKey: "program",
    header: "Program",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <SheduleListDropdown subjectId={row.original.id} />;
    },
  },
];
