"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Tables } from "types/supabase-helpers";
import ActioniDropdown from "./action-dropdown";
export type User = Tables<"user">;

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <span className="capitalize">{row.original.role}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <ActioniDropdown
          userId={row.original.id}
          userRole={row.original.role}
        />
      );
    },
  },
];
