/*
  Warnings:

  - You are about to drop the column `answers_qtd` on the `forms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "forms" DROP COLUMN "answers_qtd",
ADD COLUMN     "answers_length" INTEGER DEFAULT 0,
ADD COLUMN     "questions_length" INTEGER DEFAULT 0;
