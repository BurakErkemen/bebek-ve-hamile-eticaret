-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `parentId` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Category_slug_key`(`slug`),
    INDEX `Category_parentId_idx`(`parentId`),
    INDEX `Category_isActive_sortOrder_idx`(`isActive`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Slider` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `placement` ENUM('HOME_HERO') NOT NULL DEFAULT 'HOME_HERO',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Slider_placement_isActive_sortOrder_idx`(`placement`, `isActive`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SliderSlide` (
    `id` VARCHAR(191) NOT NULL,
    `sliderId` VARCHAR(191) NOT NULL,
    `eyebrow` VARCHAR(191) NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `primaryActionLabel` VARCHAR(191) NULL,
    `primaryActionHref` VARCHAR(191) NULL,
    `secondaryActionLabel` VARCHAR(191) NULL,
    `secondaryActionHref` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NULL,
    `imageAlt` VARCHAR(191) NULL,
    `tone` ENUM('ROSE', 'SAGE', 'PEACH') NOT NULL DEFAULT 'ROSE',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SliderSlide_sliderId_isActive_sortOrder_idx`(`sliderId`, `isActive`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Banner` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `placement` ENUM('HOME_PROMO', 'CATEGORY_PROMO', 'GLOBAL_PROMO') NOT NULL DEFAULT 'HOME_PROMO',
    `eyebrow` VARCHAR(191) NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `actionLabel` VARCHAR(191) NULL,
    `actionHref` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NULL,
    `imageAlt` VARCHAR(191) NULL,
    `tone` ENUM('ROSE', 'SAGE', 'PEACH') NOT NULL DEFAULT 'ROSE',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Banner_placement_isActive_sortOrder_idx`(`placement`, `isActive`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HomeSection` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('HERO_SLIDER', 'CATEGORY_SHOWCASE', 'PROMO_BANNER', 'PRODUCT_SHOWCASE') NOT NULL,
    `eyebrow` VARCHAR(191) NULL,
    `title` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `actionLabel` VARCHAR(191) NULL,
    `actionHref` VARCHAR(191) NULL,
    `sliderId` VARCHAR(191) NULL,
    `bannerId` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `HomeSection_type_isActive_sortOrder_idx`(`type`, `isActive`, `sortOrder`),
    INDEX `HomeSection_sliderId_idx`(`sliderId`),
    INDEX `HomeSection_bannerId_idx`(`bannerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HomeSectionItem` (
    `id` VARCHAR(191) NOT NULL,
    `sectionId` VARCHAR(191) NOT NULL,
    `itemType` ENUM('CATEGORY_CARD', 'CUSTOM_LINK', 'PRODUCT_REFERENCE') NOT NULL DEFAULT 'CUSTOM_LINK',
    `title` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `href` VARCHAR(191) NULL,
    `badge` VARCHAR(191) NULL,
    `tone` ENUM('ROSE', 'SAGE', 'PEACH') NOT NULL DEFAULT 'ROSE',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `HomeSectionItem_sectionId_isActive_sortOrder_idx`(`sectionId`, `isActive`, `sortOrder`),
    INDEX `HomeSectionItem_itemType_idx`(`itemType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SliderSlide` ADD CONSTRAINT `SliderSlide_sliderId_fkey` FOREIGN KEY (`sliderId`) REFERENCES `Slider`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HomeSection` ADD CONSTRAINT `HomeSection_sliderId_fkey` FOREIGN KEY (`sliderId`) REFERENCES `Slider`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HomeSection` ADD CONSTRAINT `HomeSection_bannerId_fkey` FOREIGN KEY (`bannerId`) REFERENCES `Banner`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HomeSectionItem` ADD CONSTRAINT `HomeSectionItem_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `HomeSection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
