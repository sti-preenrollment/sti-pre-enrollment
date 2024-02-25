import { SignIn } from "@assets/illustrations";
import SignInForm from "./signin-form";

function SignInPage() {
  return (
    <div className="container flex items-center justify-center gap-24 px-2">
      <SignInForm />
      <div className="hidden max-w-xl lg:block">
        <SignIn className="w-full max-w-md drop-shadow-2xl" />
      </div>
    </div>
  );
}

export default SignInPage;
