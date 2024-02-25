import { Favicon, User } from "@assets/icons";
import Link from "next/link";
import LogoutButton from "@components/ui/logout-button";
import { getServerSession } from "next-auth";
import { authOptions } from "@lib/auth";
async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="bg-primary sticky top-0 z-50">
      <nav className="navbar mx-auto h-16 gap-3 md:container">
        <div>
          <Link
            href="/student"
            className="btn border-none bg-transparent p-0 hover:bg-transparent focus:outline-white"
          >
            <Favicon className="w-10" />
          </Link>
        </div>
        <div className="flex-1">
          <span className="text-lg font-semibold text-white">
            Pre-enrollment
          </span>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className=" btn border btn-ghost">
              <div className="text-end hidden sm:block">
                <h3 className="text-neutral-200">{session?.user?.name}</h3>
                <span className="font-normal text-neutral-400 capitalize">
                  {session?.user?.role}
                </span>
              </div>
              <User className="w-6 h-6 text-white" />
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-52 bg-base-100 p-2 shadow"
            >
              <li className="pointer-events-none">
                <div className="text-end sm:hidden flex flex-col items-center">
                  <h3 className="text-black">{session?.user?.name}</h3>
                  <span className="font-normal text-neutral-400 capitalize">
                    {session?.user?.role}
                  </span>
                </div>
              </li>
              <li>
                <LogoutButton />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
export default Header;
