import { DocumentPlus, List } from "@assets/icons";
import { BookOpen } from "@assets/icons";
import { Toaster } from "sonner";
import Header from "../header";
import SideNavbar from "../side-navbar";
import Provider from "@components/provider/provider";

const navigations = [
  {
    path: "/assessor/subject-application",
    icon: <BookOpen className="w-6" />,
    title: "Subject Application",
  },
  {
    path: "/assessor/add-subject-schedule",
    icon: <DocumentPlus className="w-6" />,
    title: "Add Subject Schedule",
  },
  {
    path: "/assessor/schedule-list",
    icon: <List className="w-6" />,
    title: "Subject List",
  },
];

export default function AssessorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <div className="min-h-[100svh] pt-16 flex-1 overflow-y-auto bg-gradient-to-br from-blue-100 to-yellow-50">
            <Header />
            <main className="max-h-screen-calc overflow-y-auto p-5 relative">
              <Provider>{children}</Provider>
            </main>
          </div>
        </div>
        <SideNavbar navigations={navigations} />
      </div>
      <Toaster expand={true} richColors />
    </>
  );
}
