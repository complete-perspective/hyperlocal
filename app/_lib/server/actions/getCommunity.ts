"use server";
import { Community } from "@prisma/client";
import { keystoneContext } from "@/app/server/keystone";
import { notFound } from "next/navigation";
import { auth } from "../auth";

export async function getCommunity(slug: string) {
  const session = await auth.getSession();

  let community = null;
  try {
    community = await keystoneContext
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

    if (!community) {
      return notFound();
    }
  } catch (e) {
    console.error(e);
    notFound();
  }

  return community as Community;
}
