/*
  Warnings:

  - You are about to drop the column `community` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the column `communityProfile` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the `Community` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CourseStatusType" AS ENUM ('PUBLIC', 'PRIVATE');

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_communityProfile_fkey";

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_community_fkey";

-- DropIndex
DROP INDEX "Membership_communityProfile_idx";

-- DropIndex
DROP INDEX "Membership_community_idx";

-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "community",
DROP COLUMN "communityProfile",
ADD COLUMN     "learnerProfile" TEXT;

-- DropTable
DROP TABLE "Community";

-- DropEnum
DROP TYPE "CommunityStatusType";

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "status" "CourseStatusType" DEFAULT 'PRIVATE',

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Course_memberships" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_Course_memberships_AB_unique" ON "_Course_memberships"("A", "B");

-- CreateIndex
CREATE INDEX "_Course_memberships_B_index" ON "_Course_memberships"("B");

-- CreateIndex
CREATE INDEX "Membership_learnerProfile_idx" ON "Membership"("learnerProfile");

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_learnerProfile_fkey" FOREIGN KEY ("learnerProfile") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Course_memberships" ADD CONSTRAINT "_Course_memberships_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Course_memberships" ADD CONSTRAINT "_Course_memberships_B_fkey" FOREIGN KEY ("B") REFERENCES "Membership"("id") ON DELETE CASCADE ON UPDATE CASCADE;
