"use client";

import { LoadingComponent } from "@components/ui";
import { groupSchedules } from "@helper/groupSchedules";
import { modalAction } from "@helper/modalAction";
import { useCreateQueryString } from "@hooks/useCreateQueryString";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import supabase from "utils/supabase";

type Schedule = {
  days: string[];
  room: string;
  time: string;
};

function ScheduleModal() {
  const router = useRouter();
  const createQueryString = useCreateQueryString();
  const [scheduleList, setScheduleList] = useState<Schedule[] | null>(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id")!;

  useEffect(() => {
    if (!id) return;

    const abortController = new AbortController();
    (async () => {
      const { data: schedules } = await supabase
        .from("subject_schedule")
        .select("*")
        .eq("subject_id", id)
        .abortSignal(abortController.signal);

      if (!schedules) {
        return;
      }

      const groupedSchedules = groupSchedules(schedules);

      setScheduleList(groupedSchedules);
    })();

    return () => {
      abortController.abort();
    };
  }, [id]);

  const handleClose = () => {
    router.push("?" + createQueryString("id", ""));
    setScheduleList(null);
    modalAction("schedule_modal", "close");
  };

  return (
    <dialog id="schedule_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Subject Schedule</h3>
        <div className="divider divider-primary"></div>
        {!scheduleList ? (
          <div className="flex justify-center">
            <LoadingComponent size="md" />
          </div>
        ) : (
          <div className="overflow-x-auto border rounded-md">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Day/s</th>
                  <th>Time</th>
                  <th>Room</th>
                </tr>
              </thead>
              <tbody>
                {scheduleList.map((schedule, index) => (
                  <tr key={index}>
                    <td>{schedule.days.join("/")}</td>
                    <td>{schedule.time}</td>
                    <td>{schedule.room}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="modal-action">
          <button onClick={handleClose} className="btn btn-error text-white">
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}
export default ScheduleModal;
