import SideNavbar from "../side-navbar";
import Header from "../header";
import { Window, Users, List, Identificatioin } from "@assets/icons";
import Provider from "@components/provider/provider";

const navigations = [
  {
    path: "/admission/enrollment-application",
    icon: <Users className="w-6" />,
    title: "enrollment application",
  },
  {
    path: "/admission/student-list",
    icon: <List className="w-6" />,
    title: "student list",
  },
  {
    path: "/admission/account-management",
    icon: <Identificatioin className="w-6" />,
    title: "account management",
  },
  {
    path: "/admission/reports",
    icon: <Window className="w-6" />,
    title: "reports",
  },
];

export default function RegistrarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <div className="min-h-[100svh] flex-1 pt-16 overflow-y-auto bg-gradient-to-br from-blue-100 to-yellow-50">
            <Header />
            <main className="max-h-screen-calc overflow-y-auto p-5">
              <Provider>{children}</Provider>
            </main>
          </div>
        </div>
        <SideNavbar navigations={navigations} />
      </div>
    </>
  );
}
