"use client";

import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { Schedule, SubjectSchedule } from "./upload-modal";

export const columns: ColumnDef<SubjectSchedule>[] = [
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
    accessorKey: "units",
    header: "Units",
  },
  {
    accessorKey: "program",
    header: "Program",
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

function groupSchedules(schedules: Schedule[]) {
  const grouped: {
    [key: string]: { time: string; room: string; days: string[] };
  } = {};

  schedules.forEach((schedule) => {
    const key = `${schedule.start}-${schedule.end}-${schedule.room}`;
    if (!grouped[key]) {
      grouped[key] = {
        time: `${schedule.start} to ${schedule.end}`,
        room: schedule.room!,
        days: [schedule.day!.slice(0, 3)],
      };
    } else {
      grouped[key].days.push(schedule.day!.slice(0, 3));
    }
  });

  return Object.values(grouped);
}
