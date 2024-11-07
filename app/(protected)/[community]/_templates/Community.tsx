"use client";

import React from "react";
import { useCommunityQuery } from "@/app/client/hooks/useCommunity";
import { useAuthSession } from "@/app/client/hooks/useAuthSession";

export const CommunityTemplate: React.FC<{ slug: string }> = ({ slug }) => {
  const { data: pageData, isPending: isPendingPageData } = useCommunityQuery({
    slug,
  });
  const { data: authData, isPending: isPendingAuthData } = useAuthSession();

  if (isPendingPageData) {
    return <p>Loading page data...</p>;
  }

  return (
    <main>
      <h1>{pageData?.name}</h1>
      <p>{pageData?.description}</p>
      {isPendingAuthData && <p>Loading auth data...</p>}
      {authData && <code>{JSON.stringify(authData, null, 2)}</code>}
    </main>
  );
};
