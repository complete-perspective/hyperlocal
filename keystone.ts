import "dotenv/config";
import { config } from "@keystone-6/core";
import { createAuth } from "@keystone-6/auth";
import { statelessSessions } from "@keystone-6/core/session";
import { lists } from "./schema";
import { insertSeedData } from "./seed-data";

const session = statelessSessions({
  maxAge: parseInt(
    process.env.AUTH_SESSION_EXPIRY || `${60 * 60 * 24 * 360}`,
    10
  ),
  secret: process.env.AUTH_SESSION_SECRET,
});

const { withAuth } = createAuth({
  listKey: "Person",
  identityField: "email",
  secretField: "password",
  sessionData: "id name email isAdmin", // fields available in session.data
  initFirstItem: {
    fields: ["name", "email", "password", "isAdmin"],
    skipKeystoneWelcome: true,
  },
});

export default withAuth(
  config({
    session,
    lists,
    server: {
      cors: {
        origin: ["http://localhost:7777"],
        credentials: true,
      },
    },
    db: {
      provider: "postgresql",
      url: process.env.DATABASE_URL || "postgres://localhost:5432/api-dev",
      onConnect: async (context) => {
        console.log("💾 Connected to database");
        // if (process.argv.includes("--seed-data")) {
        //   context.session = { data: { isAdmin: true } };
        //   await insertSeedData(context);
        // }
      },
      // Optional advanced configuration
      enableLogging: true,
    },
    ui: {
      isDisabled: false,
      isAccessAllowed: (context) => !!context?.session?.data?.isAdmin,
    },
  })
);
