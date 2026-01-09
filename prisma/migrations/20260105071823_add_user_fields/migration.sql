/*
  Warnings:

  - You are about to drop the column `preferredUniversity` on the `StudentProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StudentProfile" DROP COLUMN "preferredUniversity",
ADD COLUMN     "diplomaPercentage" DOUBLE PRECISION,
ADD COLUMN     "jeePercentile" DOUBLE PRECISION,
ADD COLUMN     "pcbPercentile" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isRegistered" BOOLEAN NOT NULL DEFAULT false;
