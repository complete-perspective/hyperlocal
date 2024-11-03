-- CreateEnum
CREATE TYPE "CommunityStatusType" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "owner" TEXT,
    "nickname" TEXT NOT NULL DEFAULT '',
    "bio" TEXT NOT NULL DEFAULT '',
    "avatar" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Community" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "status" "CommunityStatusType" DEFAULT 'PRIVATE',

    CONSTRAINT "Community_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "owner" TEXT,
    "community" TEXT,
    "communityProfile" TEXT,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Profile_owner_idx" ON "Profile"("owner");

-- CreateIndex
CREATE UNIQUE INDEX "Community_slug_key" ON "Community"("slug");

-- CreateIndex
CREATE INDEX "Membership_owner_idx" ON "Membership"("owner");

-- CreateIndex
CREATE INDEX "Membership_community_idx" ON "Membership"("community");

-- CreateIndex
CREATE INDEX "Membership_communityProfile_idx" ON "Membership"("communityProfile");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_owner_fkey" FOREIGN KEY ("owner") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_owner_fkey" FOREIGN KEY ("owner") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_community_fkey" FOREIGN KEY ("community") REFERENCES "Community"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_communityProfile_fkey" FOREIGN KEY ("communityProfile") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
