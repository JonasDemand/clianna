-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` TEXT NULL,
    `salt` TEXT NULL,
    `googleId` VARCHAR(191) NULL,
    `refreshToken` TEXT NULL,
    `gapiAccess` BOOLEAN NOT NULL DEFAULT false,
    `cliannaFolderId` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_googleId_key`(`googleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(191) NULL,
    `lastname` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `street` VARCHAR(191) NULL,
    `streetnumber` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `postalcode` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `mobile` VARCHAR(191) NULL,
    `whatsapp` BOOLEAN NULL,
    `shoesize` DOUBLE NULL,
    `disabled` BOOLEAN NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NULL,
    `creationDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `pending` BOOLEAN NOT NULL DEFAULT true,
    `shippingType` ENUM('Send', 'Collect', 'Visit') NULL,
    `comment` VARCHAR(191) NULL,
    `price` DOUBLE NULL,
    `taxes` ENUM('Nineteen', 'Seven') NULL,
    `dueDate` DATETIME(3) NULL,
    `type` ENUM('Einlagen', 'Einlagenarbeiten', 'Abrolloptimierung', 'Schuharbeiten', 'Massschuhleisten', 'Massschuhe', 'Schuhbestellung', 'Miscellaneous') NULL,
    `specification` ENUM('Sport', 'Business', 'Casual', 'Workwear', 'Massschuhe', 'SchuhleistenEinleisten', 'Erstlieferung', 'Nachlieferung') NULL,
    `brand` VARCHAR(191) NULL,
    `article` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `dealer` VARCHAR(191) NULL,
    `size` DOUBLE NULL,
    `name` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Document` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NULL,
    `orderId` VARCHAR(191) NULL,
    `googleId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `template` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
