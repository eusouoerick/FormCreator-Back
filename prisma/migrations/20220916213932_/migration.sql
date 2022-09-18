/*
  Warnings:

  - A unique constraint covering the columns `[hash]` on the table `forms` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "forms_hash_key" ON "forms"("hash");
