import { KeystoneContext } from "@keystone-6/core/types";
import type { TypeInfo } from ".keystone/types";
import { courses, people, memberships } from "./data";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function deleteLists(lists: string[], context: KeystoneContext<any>) {
  for (let i = 0; i < lists.length; i++) {
    const existingItems = await context.db[lists[i]].findMany();
    for (const deleteItem of existingItems) {
      try {
        await context.db[lists[i]].deleteOne({
          where: { id: `${deleteItem.id}` },
        });
        console.log(`🗑️  Deleted ${lists[i]} ${deleteItem.id}...`);
      } catch {
        console.log(`🚨 Error deleting ${lists[i]} ${deleteItem.id}`);
      }
    }
  }
}

export async function insertSeedData(context: KeystoneContext<TypeInfo>) {
  console.log("🚨 Resetting database...");

  // DESTROY all existing lists
  const lists = ["Person", "Course", "Profile", "Membership"];

  await deleteLists(lists, context);

  console.log(`🌱 Inserting seed data`);

  // CREATE seed data
  for (const course of courses) {
    await context.query.Course.createOne({
      data: course,
    });
  }

  for (const person of people) {
    await context.query.Person.createOne({
      data: person,
    });
  }

  for (const membership of memberships) {
    await context.query.Membership.createOne({
      data: membership,
    });
  }

  console.log(`✅ Seed data inserted`);
  console.log(`👋 Please start the process with \`pnpm dev\``);
  process.exit();
}
