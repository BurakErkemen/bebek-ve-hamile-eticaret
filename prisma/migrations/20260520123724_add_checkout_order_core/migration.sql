-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `orderNumber` VARCHAR(191) NOT NULL,
    `merchantOid` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'PENDING_PAYMENT', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    `paymentStatus` ENUM('NOT_STARTED', 'PENDING', 'SUCCESS', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'NOT_STARTED',
    `customerFirstName` VARCHAR(191) NOT NULL,
    `customerLastName` VARCHAR(191) NOT NULL,
    `customerEmail` VARCHAR(191) NOT NULL,
    `customerPhone` VARCHAR(191) NOT NULL,
    `shippingCountry` VARCHAR(191) NOT NULL DEFAULT 'Türkiye',
    `shippingCity` VARCHAR(191) NOT NULL,
    `shippingDistrict` VARCHAR(191) NOT NULL,
    `shippingNeighborhood` VARCHAR(191) NULL,
    `shippingPostalCode` VARCHAR(191) NULL,
    `shippingAddressLine` TEXT NOT NULL,
    `customerNote` TEXT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `shippingFee` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `discountAmount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `totalAmount` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Order_orderNumber_key`(`orderNumber`),
    UNIQUE INDEX `Order_merchantOid_key`(`merchantOid`),
    INDEX `Order_status_paymentStatus_idx`(`status`, `paymentStatus`),
    INDEX `Order_customerEmail_idx`(`customerEmail`),
    INDEX `Order_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItem` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NULL,
    `variantId` VARCHAR(191) NULL,
    `productName` VARCHAR(191) NOT NULL,
    `productSlug` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `variantLabel` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `unitPrice` DECIMAL(10, 2) NOT NULL,
    `compareAtPrice` DECIMAL(10, 2) NULL,
    `quantity` INTEGER NOT NULL,
    `lineTotal` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `OrderItem_orderId_idx`(`orderId`),
    INDEX `OrderItem_productId_idx`(`productId`),
    INDEX `OrderItem_variantId_idx`(`variantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `ProductVariant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
