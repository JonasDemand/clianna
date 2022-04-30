/*
  Warnings:

  - Added the required column `forename` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brand` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pending` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shop` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_customerId_fkey`;

-- AlterTable
ALTER TABLE `Customer` ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `forename` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `street` VARCHAR(191) NULL,
    ADD COLUMN `surname` VARCHAR(191) NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Order` ADD COLUMN `brand` VARCHAR(191) NOT NULL,
    ADD COLUMN `date` DATETIME(3) NOT NULL,
    ADD COLUMN `model` VARCHAR(191) NOT NULL,
    ADD COLUMN `pending` BOOLEAN NOT NULL,
    ADD COLUMN `shop` VARCHAR(191) NOT NULL,
    MODIFY `customerId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
