"use client";

import { groupSchedules } from "@helper/groupSchedules";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { HTMLProps } from "react";
import { Tables } from "types/supabase-helpers";

export interface Subject extends Tables<"subject"> {
  subject_schedule: Tables<"subject_schedule">[];
}

export const columns: ColumnDef<Subject>[] = [
  {
    id: "select",
    cell: ({ row }) => (
      <div className="px-1">
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      </div>
    ),
  },
  {
    accessorKey: "subject_name",
    header: "Name",
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
    accessorKey: "subject_schedule",
    header: "Schedule",
    cell: ({ row }) => {
      const groupedSchedules = groupSchedules(row.original.subject_schedule);

      return groupedSchedules.map((schedule, index) => (
        <div key={index} className="min-w-[15rem]">
          <span className="capitalize font-semibold">
            {schedule.days.join("/")}
          </span>
          {` - ${schedule.time} - ${schedule.room}`}
        </div>
      ));
    },
  },
];

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={
        className + " cursor-pointer checkbox checkbox-primary checkbox-sm"
      }
      {...rest}
    />
  );
}
