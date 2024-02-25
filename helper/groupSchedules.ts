import { Tables } from "types/supabase-helpers";

export function groupSchedules(schedules: Tables<"subject_schedule">[]) {
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
