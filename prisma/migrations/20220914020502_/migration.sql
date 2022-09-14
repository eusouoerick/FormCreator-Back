-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_formId_fkey";

-- DropForeignKey
ALTER TABLE "forms" DROP CONSTRAINT "forms_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "inputs" DROP CONSTRAINT "inputs_questionId_fkey";

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_formId_fkey";

-- AddForeignKey
ALTER TABLE "forms" ADD CONSTRAINT "forms_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_formId_fkey" FOREIGN KEY ("formId") REFERENCES "forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_formId_fkey" FOREIGN KEY ("formId") REFERENCES "forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inputs" ADD CONSTRAINT "inputs_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
