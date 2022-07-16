/*
  Warnings:

  - You are about to drop the column `brand` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `model` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shop` on the `Order` table. All the data in the column will be lost.
  - Added the required column `creationDate` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingType` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxes` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Order` DROP COLUMN `brand`,
    DROP COLUMN `date`,
    DROP COLUMN `model`,
    DROP COLUMN `shop`,
    ADD COLUMN `comment` VARCHAR(191) NULL,
    ADD COLUMN `creationDate` DATETIME(3) NOT NULL,
    ADD COLUMN `price` DOUBLE NULL,
    ADD COLUMN `shippingType` INTEGER NOT NULL,
    ADD COLUMN `taxes` INTEGER NOT NULL,
    MODIFY `pending` BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE `OrderDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NULL,
    `key` INTEGER NOT NULL,
    `value` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OrderDetails` ADD CONSTRAINT `OrderDetails_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
