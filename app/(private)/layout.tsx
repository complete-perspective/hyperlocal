import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/app/server/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await auth.isAuthenticated())) {
    redirect("/");
  }

  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </>
  );
}
