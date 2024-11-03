import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/app/server/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.getSession();
  if (!session.data) {
    // User is not authenticated
    redirect("/");
  }

  return (
    <>
      <header>
        Welcome Back, {session.data?.name}
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
