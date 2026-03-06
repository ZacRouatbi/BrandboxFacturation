/*
  Warnings:

  - You are about to drop the column `email` on the `tier` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tier` DROP COLUMN `email`,
    ADD COLUMN `mf` VARCHAR(191) NULL;
