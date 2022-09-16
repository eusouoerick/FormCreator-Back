/*
  Warnings:

  - You are about to drop the column `correct_answer` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the `inputs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "inputs" DROP CONSTRAINT "inputs_questionId_fkey";

-- AlterTable
ALTER TABLE "forms" ALTER COLUMN "value" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "correct_answer",
ADD COLUMN     "inputs" TEXT[];

-- DropTable
DROP TABLE "inputs";
