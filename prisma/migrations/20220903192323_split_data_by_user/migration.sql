/*
  Warnings:

  - Added the required column `userId` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Made the column `creationDate` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Customer` ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Order` ADD COLUMN `userId` INTEGER NOT NULL,
    MODIFY `creationDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `Document` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `customerId` INTEGER NULL,
    `orderId` INTEGER NULL,
    `googleId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `template` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
