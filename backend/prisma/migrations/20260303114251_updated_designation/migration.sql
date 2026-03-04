/*
  Warnings:

  - The primary key for the `designation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `designation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE `designation` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(50) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `DesignationSequence` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `month` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `counter` INTEGER NOT NULL,

    UNIQUE INDEX `DesignationSequence_month_year_key`(`month`, `year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
