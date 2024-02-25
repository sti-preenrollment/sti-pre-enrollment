import { LogoDark } from "@assets/icons";

function Footer() {
  return (
    <footer className="bg-primary-dark text-white ">
      <div className="container footer mx-auto  px-2  py-10">
        <aside className="">
          <LogoDark />
          <p>
            STI College Calamba
            <br />
            PUROK 1 NATL HI-WAY, BARANGAY UNO, , Calamba, Philippines
          </p>
        </aside>
        <nav>
          <header className="footer-title">Social</header>
          <div className="grid grid-flow-col gap-4">
            <a
              aria-label="facebook"
              href="https://www.facebook.com/calamba.sti.edu"
              target="_blank"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="w-12 fill-current"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
          </div>
        </nav>
      </div>
    </footer>
  );
}
export default Footer;
