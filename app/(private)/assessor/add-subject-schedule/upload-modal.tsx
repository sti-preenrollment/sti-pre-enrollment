"use client";

import { modalAction } from "@helper/modalAction";
import { useState } from "react";
import * as XLSX from "xlsx";
import DataTable from "./data-table";
import { columns } from "./column";
import { toast } from "sonner";

type ParsedSubject = {
  subject_name: string;
  subject_code: string;
  instructor: string | null;
  year_level: "First Year" | "Second Year" | "Third Year" | "Fourth Year";
  program: string;
  section: string;
  units: string;
  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  start: string;
  end: string;
  room: string;
};

export type Schedule = {
  start: string;
  end: string;
  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  room: string;
};

export type SubjectSchedule = {
  subject_name: string;
  subject_code: string;
  instructor: string | null;
  units: string;
  year_level: "First Year" | "Second Year" | "Third Year" | "Fourth Year";
  program: string;
  section: string;
  subject_schedule: Schedule[];
};

function UploadModal() {
  const [schedules, setSchedules] = useState<SubjectSchedule[] | null>(null);
  const [inputKey, setInputKey] = useState(Date.now());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setSchedules([]);

    const files = e.target.files;
    if (!files || files.length === 0) return;

    const reader = new FileReader();
    reader.readAsBinaryString(files[0]);
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary", raw: true });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      let parseData = XLSX.utils.sheet_to_json<ParsedSubject>(sheet);

      let subjects: Record<string, SubjectSchedule> = {};

      parseData.forEach((row) => {
        let {
          subject_name,
          subject_code,
          instructor,
          year_level,
          program,
          section,
          units,
          day,
          start,
          end,
          room,
        } = row;
        let key = `${subject_name}-${subject_code}-${instructor}-${year_level}-${program}-${section}`;

        if (!subjects[key]) {
          subjects[key] = {
            subject_name,
            subject_code,
            units: units.toString(),
            instructor: instructor ?? "",
            year_level,
            section,
            program,
            subject_schedule: [],
          };
        }

        subjects[key].subject_schedule.push({
          start,
          end,
          day,
          room,
        });
      });

      // Convert the subjects object into an array
      let outputData = Object.values(subjects);
      setSchedules(outputData);
    };
  };

  const handleClose = () => {
    setInputKey(Date.now());
    setSchedules(null);
    modalAction("upload_modal", "close");
  };

  const handleUpload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/assessor/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(schedules),
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error("Upload failed. Try again.");
        console.log(data.message);
        return;
      }

      toast.success(data.message);
    } catch (error) {
      toast.error("Something went wrong.");
      console.error(error);
    } finally {
      setInputKey(Date.now());
      setSchedules(null);
      setIsLoading(false);
      modalAction("upload_modal", "close");
    }
  };

  return (
    <dialog id="upload_modal" className="modal">
      <div className="modal-box w-auto max-w-6xl overflow-y-auto">
        <h3 className="font-bold text-lg">Upload Schedules</h3>
        <div className="divider divider-primary"></div>
        <div className="flex justify-center p-2">
          <input
            key={inputKey}
            type="file"
            accept=".xlsx, .xls"
            className="file-input file-input-primary file-input-bordered w-full max-w-xs"
            onChange={handleFileUpload}
          />
        </div>

        {schedules && (
          <div className="max-h-[60svh] relative overflow-y-auto min-h-[20svh] p-3">
            <DataTable columns={columns} data={schedules} />
          </div>
        )}

        <div className="modal-action">
          <button
            disabled={isLoading}
            onClick={handleClose}
            className="btn btn-error text-white"
          >
            Close
          </button>
          <button
            disabled={isLoading}
            onClick={handleUpload}
            className="btn btn-success text-white"
          >
            Upload
          </button>
        </div>
      </div>
    </dialog>
  );
}
export default UploadModal;
