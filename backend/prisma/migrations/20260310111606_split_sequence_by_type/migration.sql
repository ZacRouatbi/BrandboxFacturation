/*
  Warnings:

  - The primary key for the `documentsequence` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `documentsequence` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[prefix,year]` on the table `DocumentSequence` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `documentsequence` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    MODIFY `month` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `DocumentSequence_prefix_year_key` ON `DocumentSequence`(`prefix`, `year`);
