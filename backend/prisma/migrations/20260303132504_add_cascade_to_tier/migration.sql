-- DropForeignKey
ALTER TABLE `document` DROP FOREIGN KEY `Document_tierId_fkey`;

-- DropIndex
DROP INDEX `Document_tierId_fkey` ON `document`;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_tierId_fkey` FOREIGN KEY (`tierId`) REFERENCES `Tier`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
