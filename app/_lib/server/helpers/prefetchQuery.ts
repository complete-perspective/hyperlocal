"use server";

import { auth } from "../auth";
import { keystoneContext } from "../keystone";
import { Community } from "@prisma/client";

export const prefetchCommunity = async (slug: string) => {
  const session = await auth.getSession();

  const community = await keystoneContext
    .withSession(session)
    .query.Community.findOne({
      where: { slug },
      query: `id name description slug
          memberships {
            communityProfile {
              nickname
            }
          }`,
    });

  // turn into simple obect to marshal over the wire;
  const communityObj = JSON.parse(JSON.stringify(community));

  return communityObj as Community;
};
