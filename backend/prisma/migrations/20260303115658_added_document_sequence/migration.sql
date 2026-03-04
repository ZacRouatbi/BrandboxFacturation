-- CreateTable
CREATE TABLE `DocumentSequence` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `prefix` VARCHAR(191) NOT NULL,
    `month` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `counter` INTEGER NOT NULL,

    UNIQUE INDEX `DocumentSequence_prefix_month_year_key`(`prefix`, `month`, `year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
