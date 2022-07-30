-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `admin` BOOLEAN NOT NULL DEFAULT false,
    `password` TEXT NOT NULL,
    `salt` TEXT NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `street` VARCHAR(191) NULL,
    `streetnumber` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `postalcode` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `shoesize` DOUBLE NULL,
    `disabled` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `creationDate` DATETIME(3) NOT NULL,
    `pending` BOOLEAN NOT NULL DEFAULT true,
    `shippingType` INTEGER NOT NULL,
    `comment` VARCHAR(191) NULL,
    `price` DOUBLE NOT NULL,
    `taxes` INTEGER NOT NULL,
    `dueDate` DATETIME(3) NULL,
    `type` INTEGER NULL,
    `specification` INTEGER NULL,
    `brand` VARCHAR(191) NULL,
    `article` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `dealer` VARCHAR(191) NULL,
    `size` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
