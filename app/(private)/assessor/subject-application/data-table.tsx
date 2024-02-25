"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { SubjectAssessment } from "./columns";
import classNames from "classnames";

interface DataTableProps<TData extends SubjectAssessment, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends SubjectAssessment, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.subject_assessment_id,
  });

  return (
    <>
      <div className="card-actions justify-end mb-4">
        <input
          type="text"
          placeholder="Search"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="input input-bordered input-xs py-4 w-full max-w-[15rem]"
        />
      </div>
      <div className="rounded-md border">
        <table className="table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-primary text-white">
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            <div className="">
                              {header.id === "status" ? (
                                <select
                                  className="border rounded-md outline-none mt-2 text-black"
                                  value={
                                    header.column.getFilterValue() as string
                                  }
                                  onChange={(e) =>
                                    header.column.setFilterValue(e.target.value)
                                  }
                                >
                                  <option value="">All</option>
                                  <option value="pending">Pending</option>
                                  <option value="approved">Approved</option>
                                  <option value="rejected">Rejected</option>
                                </select>
                              ) : null}
                              {header.id === "print_status" ? (
                                <select
                                  className="border rounded-md outline-none mt-2 text-black"
                                  value={
                                    header.column.getFilterValue() as string
                                  }
                                  onChange={(e) =>
                                    header.column.setFilterValue(e.target.value)
                                  }
                                >
                                  <option value="">All</option>
                                  <option value="pending">Pending</option>
                                  <option value="for printing">
                                    For printing
                                  </option>
                                  <option value="printed">Printed</option>
                                </select>
                              ) : null}
                            </div>
                          </div>
                        </>
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
                <tr key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={classNames({
                        hidden: cell.id === "contact_email",
                      })}
                    >
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
        className="card-actions justify-end mt-4
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
    </>
  );
}
