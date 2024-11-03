/* eslint-disable @typescript-eslint/no-unused-vars */
import { randomBytes } from "node:crypto";
import { getIronSession, SessionOptions } from "iron-session";
import Iron from "@hapi/iron";
import { cookies } from "next/headers";
import type { SessionStrategy } from "@keystone-6/core/types";
import { keystoneContext } from "./keystone";

const AUTH_SESSION_NAME = process.env.AUTH_SESSION_NAME as string;
const AUTH_SESSION_SECRET = process.env.AUTH_SESSION_SECRET as string;
const AUTH_SESSION_EXPIRY = process.env.AUTH_SESSION_EXPIRY as string;

// Keystone does not expose this interface, so we need to define it here
// Note: @hapi/iron package is only used in this file for the ironOptions default param
export interface StatelessSessionsOptions {
  /**
   * Secret used by https://github.com/hapijs/iron for encapsulating data. Must be at least 32 characters long
   */
  secret?: string;
  /**
   * Iron seal options for customizing the key derivation algorithm used to generate encryption and integrity verification keys as well as the algorithms and salt sizes used.
   * See https://hapi.dev/module/iron/api/?v=6.0.0#options for available options.
   *
   * @default Iron.defaults
   */
  ironOptions?: Iron.SealOptions;
  /**
   * Specifies the number (in seconds) to be the value for the `Max-Age`
   * `Set-Cookie` attribute.
   *
   * @default 60 * 60 * 8 // 8 hours
   */
  maxAge?: number;
  /**
   * The name of the cookie used by `Set-Cookie`.
   *
   * @default keystonejs-session
   */
  cookieName?: string;
  /**
   * Specifies the boolean value for the [`Secure` `Set-Cookie` attribute](https://tools.ietf.org/html/rfc6265#section-5.2.5).
   *
   * *Note* be careful when setting this to `true`, as compliant clients will
   * not send the cookie back to the server in the future if the browser does
   * not have an HTTPS connection.
   *
   * @default process.env.NODE_ENV === 'production'
   */
  secure?: boolean;
  /**
   * Specifies the value for the [`Path` `Set-Cookie` attribute](https://tools.ietf.org/html/rfc6265#section-5.2.4).
   *
   * @default '/'
   */
  path?: string;
  /**
   * Specifies the domain for the [`Domain` `Set-Cookie` attribute](https://tools.ietf.org/html/rfc6265#section-5.2.3)
   *
   * @default current domain
   */
  domain?: string;
  /**
   * Specifies the boolean or string to be the value for the [`SameSite` `Set-Cookie` attribute](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-03#section-4.1.2.7).
   *
   * @default 'lax'
   */
  sameSite?: true | false | "lax" | "strict" | "none";
}

export interface SessionData {
  listKey: string;
  itemId: string;
  data?: {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
  };
}

export const defaultSession: SessionData = {
  listKey: "",
  itemId: "",
};

export const sessionOptions: SessionOptions = {
  password: AUTH_SESSION_SECRET,
  cookieName: AUTH_SESSION_NAME,
  cookieOptions: {
    maxAge: parseInt(AUTH_SESSION_EXPIRY, 10),
    // secure only works in `https` environments
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
};

export function ironSessions<Session extends SessionData>({
  secret = randomBytes(32).toString("base64url"),
  maxAge = 60 * 60 * 8, // 8 hours,
  cookieName = process.env.AUTH_SESSION_NAME,
  path = "/",
  secure = process.env.NODE_ENV === "production",
  domain,
  sameSite,
}: StatelessSessionsOptions = {}): SessionStrategy<Session, any> {
  // atleast 192-bit in base64
  if (secret.length < 32) {
    throw new Error("The session secret must be at least 32 characters long");
  }

  return {
    async get({ context }) {
      const session = await getIronSession<SessionData>(
        cookies(),
        sessionOptions
      );

      return session as unknown as Session;
    },
    async end({ context }) {
      const session = await getIronSession<SessionData>(
        cookies(),
        sessionOptions
      );

      await session.destroy();
    },
    async start({ context, data }) {
      const session = await getIronSession<SessionData>(
        cookies(),
        sessionOptions
      );

      try {
        const person = await keystoneContext
          .withSession({ data: { isAdmin: true } })
          .query.Person.findOne({
            where: { id: data?.itemId },
            query: "id name email isAdmin",
          });

        session.data = {
          id: person?.id,
          name: person?.name,
          email: person?.email,
          isAdmin: person?.isAdmin,
        };

        await session.save();
      } catch (err) {
        console.log(err);
      }

      const sessionToken = cookies().get(AUTH_SESSION_NAME)?.value;
      return sessionToken;
    },
  };
}
