/*
  Warnings:

  - You are about to drop the `OrderDetails` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `OrderDetails` DROP FOREIGN KEY `OrderDetails_orderId_fkey`;

-- AlterTable
ALTER TABLE `Order` ADD COLUMN `article` VARCHAR(191) NULL,
    ADD COLUMN `brand` VARCHAR(191) NULL,
    ADD COLUMN `color` VARCHAR(191) NULL,
    ADD COLUMN `dealer` VARCHAR(191) NULL,
    ADD COLUMN `dueDate` DATETIME(3) NULL,
    ADD COLUMN `size` DOUBLE NULL,
    ADD COLUMN `type` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `OrderDetails`;
