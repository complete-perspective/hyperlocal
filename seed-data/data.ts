import { CommunityStatusType } from "@prisma/client";

export const people = [
  {
    name: "Admin",
    email: "admin@example.com",
    password: "Password123!",
    isAdmin: true,
  },
  {
    name: "Sally",
    email: "sally@example.com",
    password: "Password123!",
    isAdmin: false,
    profiles: {
      create: [
        {
          nickname: "SalSal",
          bio: "I am a software engineer",
        },
      ],
    },
    memberships: {
      create: [
        {
          community: {
            connect: {
              slug: "hyperlocal-public",
            },
          },
        },
      ],
    },
  },
  {
    name: "Bobby",
    email: "bob@example.com",
    password: "Password123!",
    isAdmin: false,
    profiles: {
      create: [
        {
          nickname: "BoB",
          bio: "I am a graphic designer",
        },
      ],
    },
    memberships: {
      create: [
        {
          community: {
            connect: {
              slug: "hyperlocal-public",
            },
          },
        },
      ],
    },
  },
];

export const communities = [
  {
    name: "Hyperlocal Public",
    description: "This is a public community",
    slug: "hyperlocal-public",
    status: CommunityStatusType.PUBLIC,
  },
  {
    name: "Hyperlocal Private",
    description: "This is a private community",
    slug: "hyperlocal-private",
    status: CommunityStatusType.PRIVATE,
  },
];
