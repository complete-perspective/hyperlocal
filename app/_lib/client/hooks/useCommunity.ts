import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Community } from "@prisma/client";

export const COMMUNITY_QUERY_KEY = "community";

export const useCommunityQuery = ({
  slug,
}: {
  slug: string;
}): UseQueryResult<Community> => {
  return useQuery({
    queryKey: [COMMUNITY_QUERY_KEY, slug],
  });
};
