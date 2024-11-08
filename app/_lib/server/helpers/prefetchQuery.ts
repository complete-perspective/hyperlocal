"use server";

import { auth } from "../auth";
import { keystoneContext } from "../keystone";
import { Course } from "@prisma/client";

export const prefetchCourse = async (slug: string) => {
  const session = await auth.getSession();

  try {
    const course = await keystoneContext
      .withSession(session)
      .query.Course.findOne({
        where: { slug },
        query: `id title description slug`,
      });

    // turn into simple obect to marshal over the wire;
    const communityObj = JSON.parse(JSON.stringify(course));

    return communityObj as Course;
  } catch (error) {
    console.error({ error });
  }
  return null;
};
