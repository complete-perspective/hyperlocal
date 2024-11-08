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
      profile: relationship({ ref: "Profile.owner" }),
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
      owner: relationship({ ref: "Person.profile" }),
      nickname: text({ validation: { isRequired: true }, isIndexed: "unique" }),
      bio: text(),
      avatar: text(),
    },
  }),
  Course: list({
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
              OR: [
                {
                  memberships: {
                    some: {
                      owner: {
                        id: {
                          equals: session?.data?.id,
                        },
                      },
                    },
                  },
                },
                { status: { equals: "PUBLIC" } },
              ],
            };
          }
          return { status: { equals: "PUBLIC" } };
        },
      },
    },
    fields: {
      title: text({ validation: { isRequired: true } }),
      description: text(),
      slug: text({ validation: { isRequired: true }, isIndexed: "unique" }),
      status: select({
        type: "enum",
        options: [
          { label: "Public", value: "PUBLIC" },
          { label: "Private", value: "PRIVATE" },
        ],
        defaultValue: "PRIVATE",
        ui: { displayMode: "segmented-control" },
      }),
      memberships: relationship({ ref: "Membership.courses", many: true }),
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
      owner: relationship({ ref: "Person.memberships" }),
      courses: relationship({ ref: "Course.memberships", many: true }),
      learnerProfile: relationship({ ref: "Profile" }),
    },
  }),
};
