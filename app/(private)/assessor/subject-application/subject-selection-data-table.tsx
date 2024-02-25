"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Subject } from "./subject-selection-columns";
import { FieldValues, UseFormSetValue } from "react-hook-form";
import React from "react";

interface SubjectSelectionDataTableProps<TData extends Subject, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  setValue: UseFormSetValue<FieldValues>;
  initialSelectedSubjecs: Record<string, boolean>;
}

function SubjectSelectionDataTable<TData extends Subject, TValue>({
  columns,
  data,
  setValue,
  initialSelectedSubjecs,
}: SubjectSelectionDataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>(
    initialSelectedSubjecs
  );
  const [overlaps, setOverlaps] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
      globalFilter,
    },
    getRowId: (row) => row.id,
    enableRowSelection: ({ original }) => {
      return !overlaps.includes(original.id);
    },
  });

  useEffect(() => {
    const subjectId = Object.keys(rowSelection).filter(
      (id) => rowSelection[id] === true
    );
    setSelectedSubjects(
      data.filter((subject) => subjectId.includes(subject.id))
    );
  }, [data, rowSelection]);

  useEffect(() => {
    const newOverlaps = selectedSubjects
      .flatMap(getOverlappingSubjects)
      .map((subject) => subject.id);

    setOverlaps(newOverlaps);

    function getOverlappingSubjects(targetSubject: Subject) {
      return data.filter(
        (subject) =>
          subject.id !== targetSubject.id &&
          subject.subject_schedule.some((subjectSchedule) =>
            targetSubject.subject_schedule.some(
              (targetSchedule) =>
                subjectSchedule.day === targetSchedule.day &&
                timeToMinutes(subjectSchedule.start!) <
                  timeToMinutes(targetSchedule.end!) &&
                timeToMinutes(subjectSchedule.end!) >
                  timeToMinutes(targetSchedule.start!)
            )
          )
      );
    }
    setValue("subjects", selectedSubjects);
  }, [data, selectedSubjects, setValue]);

  function timeToMinutes(time: string) {
    const [hours, minutes] = time.split(":");
    return parseInt(hours) * 60 + parseInt(minutes);
  }

  return (
    <>
      <div className="card-actions justify-between mb-4 items-end">
        <h2 className="font-semibold my-2">Subject Selection</h2>

        <input
          type="text"
          placeholder="Search"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="input input-bordered input-md focus:outline-primary w-full max-w-[15rem]"
        />
      </div>
      <div className="rounded-md border overflow-auto ">
        <table className="table">
          <thead className="bg-primary text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  className="hover"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center">
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div
        className="card-actions justify-end my-4 
      "
      >
        <div className="join">
          <button
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            className="join-item btn btn-sm"
          >
            «
          </button>
          <button className="join-item btn btn-sm" disabled>
            {table.getState().pagination.pageIndex + 1}
          </button>
          <button
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            className="join-item btn btn-sm"
          >
            »
          </button>
        </div>
      </div>
      <h2 className="font-semibold my-2">Selected Subjects</h2>
      <table className="table table-zebra border rounded-md">
        <thead>
          <tr className="bg-primary text-white">
            <th>Code</th>
            <th>Subject Name</th>
            <th>Instructor</th>
            <th>Section</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
          {selectedSubjects.map((subject) => (
            <tr key={subject.id}>
              <td>{subject.subject_code}</td>
              <td>{subject.subject_name}</td>
              <td>{subject.instructor}</td>
              <td>{subject.section}</td>
              <td>{subject.year_level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default React.memo(
  SubjectSelectionDataTable
) as typeof SubjectSelectionDataTable;
