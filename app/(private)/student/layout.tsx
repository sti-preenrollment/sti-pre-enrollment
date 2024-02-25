import { Toaster } from "sonner";
import Header from "./header";
import Provider from "@components/provider/provider";
export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100svh] flex-1 bg-gradient-to-br from-blue-100 to-yellow-50">
      <Header />
      <main className="max-h-screen-calc overflow-y-auto px-5 py-3">
        <Provider>{children}</Provider>
      </main>
      <Toaster expand={true} richColors />
    </div>
  );
}
