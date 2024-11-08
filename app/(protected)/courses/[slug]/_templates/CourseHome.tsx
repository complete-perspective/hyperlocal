"use client";

import React from "react";
import { useCourseQuery } from "@/app/client/hooks/useCourseQuery";
import { useAuthSession } from "@/app/client/hooks/useAuthSession";

export const CourseHomeTemplate: React.FC<{ slug: string }> = ({ slug }) => {
  const { data: pageData, isPending: isPendingPageData } = useCourseQuery({
    slug,
  });
  const { data: authData, isPending: isPendingAuthData } = useAuthSession();

  if (isPendingPageData) {
    return <p>Loading page data...</p>;
  }

  return (
    <main>
      <h1>{pageData?.title}</h1>
      <p>{pageData?.description}</p>
      {isPendingAuthData && <p>Loading auth data...</p>}
      {authData && <code>{JSON.stringify(authData, null, 2)}</code>}
    </main>
  );
};
