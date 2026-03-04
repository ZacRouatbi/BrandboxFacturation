/*
  Warnings:

  - Added the required column `tva` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `document` ADD COLUMN `tva` BOOLEAN NOT NULL;
