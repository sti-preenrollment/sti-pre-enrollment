import { useEffect, useState } from "react";
import supabase from "utils/supabase";

function useSections({
  program,
  yearLevel,
}: {
  program: string | null;
  yearLevel: string | null;
}) {
  const [sections, setSections] = useState<string[]>([]);

  useEffect(() => {
    const abortController = new AbortController();

    if (!program || !yearLevel) return;

    const getSections = async () => {
      const { data: sections } = await supabase
        .from("distinct_sections")
        .select("section")
        .match({ program: program, year_level: yearLevel })
        .abortSignal(abortController.signal);

      if (!sections || sections.length < 1) {
        setSections([]);
        return;
      }

      setSections(sections.map((obj) => obj.section!));
    };

    getSections();

    return () => {
      abortController.abort();
    };
  }, [program, yearLevel]);

  return sections;
}
export default useSections;
