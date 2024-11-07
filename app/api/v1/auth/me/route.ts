import { auth } from "@/app/server/auth";

export async function GET(): Promise<Response> {
  const session = await auth.getSession();
  if (session?.data) {
    return Response.json(session, { status: 200 });
  }
  return new Response(null, {
    status: 401,
  });
}
