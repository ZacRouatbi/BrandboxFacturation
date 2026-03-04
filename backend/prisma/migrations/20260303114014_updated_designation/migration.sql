/*
  Warnings:

  - You are about to alter the column `documentId` on the `designation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.

*/
-- DropForeignKey
ALTER TABLE `designation` DROP FOREIGN KEY `Designation_documentId_fkey`;

-- DropIndex
DROP INDEX `Designation_documentId_fkey` ON `designation`;

-- AlterTable
ALTER TABLE `designation` MODIFY `quantity` DECIMAL(10, 3) NOT NULL,
    MODIFY `unitPrice` DECIMAL(15, 3) NOT NULL,
    MODIFY `total` DECIMAL(15, 3) NOT NULL,
    MODIFY `documentId` VARCHAR(50) NOT NULL;

-- AddForeignKey
ALTER TABLE `Designation` ADD CONSTRAINT `Designation_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `Document`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
