import { Logo } from "@assets/icons";
import Link from "next/link";

function Header() {
  return (
    <header className="sticky top-0 z-10 w-full bg-white shadow-md">
      <nav className="navbar mx-auto h-16 justify-between bg-base-100 px-1  md:container ">
        <Link href={"/"} className="cursor-pointer">
          <Logo />
        </Link>
        <div className="gap-1">
          <Link
            role={"button"}
            href="/sign-in"
            className=" btn  btn-ghost  rounded-none text-primary hover:bg-transparent hover:border-primary"
          >
            Login
          </Link>
          <Link
            role="button"
            href={"/enroll"}
            className="btn hidden rounded-none bg-accent text-base-100 shadow-lg hover:border-accent hover:bg-transparent hover:text-primary xs:inline-flex"
          >
            Register Now
          </Link>
        </div>
      </nav>
    </header>
  );
}
export default Header;
