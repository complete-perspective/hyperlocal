"use server";
import { Course } from "@prisma/client";
import { keystoneContext } from "@/app/server/keystone";
import { notFound } from "next/navigation";
import { auth } from "../auth";

export async function getCourse(slug: string) {
  const session = await auth.getSession();
  console.log({ slug });
  let course = null;
  try {
    course = await keystoneContext.withSession(session).query.Course.findOne({
      where: { slug },
      query: `id title description slug`,
    });

    console.log({ course });

    if (!course) {
      return notFound();
    }
  } catch (e) {
    console.error(e);
    notFound();
  }

  return course as Course;
}
