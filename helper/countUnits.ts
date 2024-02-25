import { Tables } from "types/supabase-helpers";

export function countUnits(subjects: Tables<"subject">[]) {
  let count = 0;
  for (let i = 0; i < subjects.length; i++) {
    count += parseInt(subjects[i].units!);
  }
  return count;
}
