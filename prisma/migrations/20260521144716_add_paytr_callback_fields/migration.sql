-- AlterTable
ALTER TABLE `order` ADD COLUMN `cancelledAt` DATETIME(3) NULL,
    ADD COLUMN `paidAt` DATETIME(3) NULL,
    ADD COLUMN `paymentFailureCode` VARCHAR(191) NULL,
    ADD COLUMN `paymentFailureMessage` TEXT NULL,
    ADD COLUMN `paytrTotalAmount` DECIMAL(10, 2) NULL;
