import Link from "next/link";
import { getCourse } from "@/app/_lib/server/actions/getCourse";

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const course = await getCourse(params?.slug);

  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <Link href={`/courses/${course.slug}`}>Home</Link>
            </li>
          </ul>
        </nav>
      </header>
      {children}
    </>
  );
}
