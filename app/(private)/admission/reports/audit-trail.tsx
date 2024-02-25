import supabase from "utils/supabase";

export const revalidate = 0;

async function AuditTrail() {
  const { data: auditTrail } = await supabase
    .from("audit_trail")
    .select("*")
    .order("created_at", { ascending: false });
  const { data: user } = await supabase.from("user").select("id, name");

  return (
    <div className="card bg-base-100 shadow-lg col-span-1">
      <div className="card-body">
        <h2 className="card-title">Audit Trail</h2>
        <div className="divider divider-primary my-1"></div>
        <div className="max-h-96 h-96 overflow-auto">
          {auditTrail?.map((audit) => (
            <div key={audit.student} className="border-b-2 p-2">
              <p>
                <span className="font-semibold text-neutral-500">
                  {audit.performer_name}
                </span>{" "}
                {audit.action}{" "}
                <span className="font-semibold text-neutral-500">
                  {
                    user
                      ?.filter((user) => user.id === audit.student)
                      .map((user) => user.name)[0]
                  }{" "}
                  {"'"}s request.
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default AuditTrail;
