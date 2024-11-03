import { list } from "@keystone-6/core";
import { allOperations, allowAll } from "@keystone-6/core/access";
import {
  text,
  password,
  checkbox,
  select,
  relationship,
} from "@keystone-6/core/fields";

export type Session = {
  listKey: string;
  itemId: string;
  data?: {
    id: string;
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
  if (session?.data?.isAdmin) return {}; // unfiltered for admins
  let personId;
  if (!session?.data) {
    personId = "false";
  } else {
    personId = session?.data?.id;
  }
  return {
    id: { equals: personId },
  };
}

function isAdminOrOwner({ session }: { session?: Session }) {
  if (session?.data?.isAdmin) return {}; // unfiltered for admins
  let ownerId;
  if (!session?.data) {
    ownerId = "false";
  } else {
    ownerId = session?.data?.id;
  }

  return { owner: { id: { equals: ownerId } } };
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
      memberships: relationship({ ref: "Membership.owner", many: true }),
      profiles: relationship({ ref: "Profile.owner", many: true }),
    },
  }),
  Profile: list({
    access: {
      operation: {
        ...allOperations(isAdmin),
        query: hasSession,
      },
      filter: {
        query: isAdminOrOwner,
      },
    },
    fields: {
      owner: relationship({ ref: "Person.profiles", many: false }),
      nickname: text(),
      bio: text(),
      avatar: text(),
    },
  }),
  Community: list({
    access: {
      operation: {
        query: allowAll,
        create: isAdmin,
        update: isAdmin,
        delete: isAdmin,
      },
      filter: {
        query: ({ session }) => {
          if (session?.data?.isAdmin) return {};
          if (session?.data?.id) {
            return {
              memberships: {
                some: {
                  owner: {
                    id: {
                      equals: session?.data?.id,
                    },
                  },
                },
              },
            };
          }
          return { status: { equals: "PUBLIC" } };
        },
      },
    },
    fields: {
      name: text({ validation: { isRequired: true } }),
      slug: text({ validation: { isRequired: true }, isIndexed: "unique" }),
      description: text(),
      status: select({
        type: "enum",
        options: [
          { label: "Public", value: "PUBLIC" },
          { label: "Private", value: "PRIVATE" },
        ],
        defaultValue: "PRIVATE",
        ui: { displayMode: "segmented-control" },
      }),
      memberships: relationship({ ref: "Membership.community", many: true }),
    },
  }),
  Membership: list({
    access: {
      operation: {
        ...allOperations(isAdmin),
        query: hasSession,
      },
      filter: {
        query: isAdminOrOwner,
      },
    },
    fields: {
      owner: relationship({ ref: "Person.memberships", many: false }),
      community: relationship({ ref: "Community.memberships", many: false }),
      communityProfile: relationship({ ref: "Profile", many: false }),
    },
  }),
};
