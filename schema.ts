import { list } from "@keystone-6/core";
import { allOperations } from "@keystone-6/core/access";
import { text, password, checkbox } from "@keystone-6/core/fields";

export type Session = {
  listKey: string;
  itemId: string;
  data?: {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
  };
};

function hasSession({ session }: { session?: Session }) {
  return Boolean(session);
}

function isAdmin({ session }: { session?: Session }) {
  if (!session) return false;
  return !!session?.data?.isAdmin;
}

function isAdminOrSamePerson({ session }: { session?: Session }) {
  if (!session) return false;
  if (session?.data?.isAdmin) return {}; // unfiltered for admins
  if (!session.itemId) {
    session.itemId = "false";
  }
  return {
    id: { equals: session.itemId },
  };
}

export const lists = {
  Person: list({
    access: {
      operation: {
        ...allOperations(isAdmin),
        query: hasSession,
      },
      filter: {
        query: isAdminOrSamePerson,
      },
    },
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({ validation: { isRequired: true }, isIndexed: "unique" }),
      password: password(),
      isAdmin: checkbox(),
    },
  }),
};
