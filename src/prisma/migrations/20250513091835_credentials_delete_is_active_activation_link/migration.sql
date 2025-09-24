/*
  Warnings:

  - You are about to drop the column `activationLink` on the `Credentials` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Credentials` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Credentials" DROP COLUMN "activationLink",
DROP COLUMN "isActive";
