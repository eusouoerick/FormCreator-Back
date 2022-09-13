/*
  Warnings:

  - Added the required column `token` to the `Form` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "token" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "adm" SET DEFAULT false;
