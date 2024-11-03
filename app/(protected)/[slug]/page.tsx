export const dynamic = "force-dynamic"; // defaults to auto
import { getCommunity } from "@/app/server/actions/getCommunity";

export default async function HomePage({
  params,
}: {
  params: { slug: string };
}) {
  const community = await getCommunity(params?.slug);

  return (
    <>
      <h1>{community.name}</h1>
      <p>{community.description}</p>
    </>
  );
}
