import { CourseStatusType } from "@prisma/client";

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
    profile: {
      create: {
        nickname: "SalSal",
        bio: "I am a Graphic Designer",
      },
    },
  },
  {
    name: "Bob",
    email: "bob@example.com",
    password: "Password123!",
    isAdmin: false,
    profile: {
      create: {
        nickname: "BoBBY",
        bio: "Builder of things",
      },
    },
  },
];

export const courses = [
  {
    title: "Alpha Course",
    description: "This is a public (free) course",
    slug: "alpha-course",
    status: CourseStatusType.PUBLIC,
  },
  {
    title: "Bravo Course",
    description: "This course requires a membership",
    slug: "bravo-course",
    status: CourseStatusType.PRIVATE,
  },
  {
    title: "Charlie Course",
    description: "This course requires a membership",
    slug: "charlie-course",
    status: CourseStatusType.PRIVATE,
  },
  {
    title: "Delta Course",
    description: "This course requires a membership",
    slug: "delta-course",
    status: CourseStatusType.PRIVATE,
  },
];

export const memberships = [
  {
    owner: {
      connect: {
        email: "sally@example.com",
      },
    },
    courses: {
      connect: {
        slug: "alpha-course",
      },
    },
    learnerProfile: {
      connect: {
        nickname: "SalSal",
      },
    },
  },
  {
    owner: {
      connect: {
        email: "bob@example.com",
      },
    },
    courses: {
      connect: [
        {
          slug: "bravo-course",
        },
        {
          slug: "charlie-course",
        },
      ],
    },
    learnerProfile: {
      connect: {
        nickname: "BoBBY",
      },
    },
  },
];
