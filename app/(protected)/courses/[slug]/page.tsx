import React from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/app/server/helpers/getQueryClient";
import { prefetchCourse } from "@/app/server/helpers/prefetchQuery";
import { COURSE_QUERY_KEY } from "@/app/client/hooks/useCourseQuery";
import { CourseHomeTemplate } from "./_templates/CourseHome";

export default async function CommunityHome({
  params,
}: {
  params: { slug: string };
}) {
  // Get the community slug from the URL
  const slug = params.slug;

  // Prefetch community data server side
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: [COURSE_QUERY_KEY, slug],
    queryFn: () => prefetchCourse(slug),
  });
  // Dehydrate the query client state
  const pageData = dehydrate(queryClient);

  return (
    <HydrationBoundary state={pageData}>
      <CourseHomeTemplate slug={slug} />
    </HydrationBoundary>
  );
}
