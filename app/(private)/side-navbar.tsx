import { Logo } from "@assets/icons";
import { Navigations } from "@components/ui";

function SideNavbar({
  navigations,
}: {
  navigations: { path: string; icon: JSX.Element; title: string }[];
}) {
  return (
    <div className="drawer-side z-20">
      <label
        htmlFor="my-drawer-2"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>
      <div className="menu flex min-h-full w-80 flex-col items-center bg-primary-dark text-base-content">
        <Logo className="mb-5" />

        <div className="flex w-full flex-col gap-2 text-base-200">
          <Navigations navigations={navigations} />
        </div>
      </div>
    </div>
  );
}
export default SideNavbar;
