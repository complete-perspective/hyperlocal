/*
  Warnings:

  - You are about to drop the column `owner` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[profile]` on the table `Person` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nickname]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_owner_fkey";

-- DropIndex
DROP INDEX "Profile_owner_idx";

-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "profile" TEXT;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "owner";

-- CreateIndex
CREATE UNIQUE INDEX "Person_profile_key" ON "Person"("profile");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_nickname_key" ON "Profile"("nickname");

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_profile_fkey" FOREIGN KEY ("profile") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
