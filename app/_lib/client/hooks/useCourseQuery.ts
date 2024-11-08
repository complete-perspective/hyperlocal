import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Course } from "@prisma/client";

export const COURSE_QUERY_KEY = "course";

export const useCourseQuery = ({
  slug,
}: {
  slug: string;
}): UseQueryResult<Course> => {
  return useQuery({
    queryKey: [COURSE_QUERY_KEY, slug],
  });
};
