-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_customerId_fkey`;

-- AlterTable
ALTER TABLE `Customer` MODIFY `firstname` VARCHAR(191) NULL,
    MODIFY `lastname` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Order` MODIFY `customerId` INTEGER NULL,
    MODIFY `creationDate` DATETIME(3) NULL,
    MODIFY `shippingType` INTEGER NULL,
    MODIFY `price` DOUBLE NULL,
    MODIFY `taxes` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
