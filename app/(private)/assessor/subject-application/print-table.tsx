import { Tables } from "types/supabase-helpers";

function PrintTable({ subjects }: { subjects: Tables<"subject">[] }) {
  return (
    <table className="table table-sm border">
      <thead>
        <tr>
          <th>COURSE CODE</th>
          <th>COURSE TITLE</th>
          <th>SECTION</th>
          <th>UNITS</th>
        </tr>
      </thead>
      <tbody>
        {subjects.map((subject) => (
          <tr key={subject.id}>
            <td>{subject.subject_code}</td>
            <td>{subject.subject_name}</td>
            <td>{subject.section}</td>
            <td>{subject.units}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default PrintTable;
