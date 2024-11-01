import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData, sessionOptions } from "./session";

export const auth = {
  isAuthenticated,
};

async function isAuthenticated() {
  try {
    const session = await getIronSession<SessionData>(
      cookies(),
      sessionOptions
    );
    if (session?.data) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
