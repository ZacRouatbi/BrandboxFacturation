-- CreateIndex
CREATE INDEX `Document_type_idx` ON `Document`(`type`);

-- CreateIndex
CREATE INDEX `Document_type_devisStatus_idx` ON `Document`(`type`, `devisStatus`);

-- CreateIndex
CREATE INDEX `Document_type_factureStatus_idx` ON `Document`(`type`, `factureStatus`);

-- CreateIndex
CREATE INDEX `Document_date_idx` ON `Document`(`date`);
