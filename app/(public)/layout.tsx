import Header from "./header";
import Footer from "./footer";
import { Toaster } from "sonner";
import { getServerSession } from "next-auth";
import { authOptions } from "@lib/auth";
import { redirect } from "next/navigation";
export default async function UnauthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect(`/${session.user.role}`);
  }
  return (
    <>
      <Header />
      <main className="min-h-screen-content grid place-items-center bg-gradient-to-br from-blue-100 to-yellow-50">
        {children}
      </main>
      <Footer />
      <Toaster expand={true} richColors />
    </>
  );
}
