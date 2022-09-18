/*
  Warnings:

  - You are about to drop the column `token` on the `forms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "forms" DROP COLUMN "token",
ADD COLUMN     "hash" TEXT;
