/*
  Warnings:

  - Changed the type of `tva` on the `document` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `document` DROP COLUMN `tva`,
    ADD COLUMN `tva` DECIMAL(5, 2) NOT NULL;
