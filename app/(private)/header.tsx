import { LogoutButton } from "@components/ui";
import { Bar, User } from "@assets/icons";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@lib/auth";

async function Header() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  return (
    <header className="fixed left-0 right-0 top-0 z-10 max-h-16 bg-base-100 shadow-md">
      <nav className="navbar">
        <div className="flex-none"></div>
        <div className="flex-1">
          <label
            htmlFor="my-drawer-2"
            className=" drawer-button cursor-pointer lg:hidden"
          >
            <Bar className="w-7" />
          </label>
        </div>
        <div className="flex-none">
          <div className="flex-none">
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn bg-transparent border-none capitalize hover:bg-slate-100"
              >
                <div className="text-end">
                  <h3>{user?.name}</h3>
                  <span className="font-normal text-slate-700">
                    {user?.role.toLowerCase()}
                  </span>
                </div>
                <User className="w-6" />
              </label>
              <ul
                tabIndex={0}
                className="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-52 bg-base-100 p-2 shadow"
              >
                <li>
                  <LogoutButton />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
export default Header;
