/*
  Warnings:

  - You are about to drop the column `userId` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `cliannaFolderId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `googleId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Customer` DROP FOREIGN KEY `Customer_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Document` DROP FOREIGN KEY `Document_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_userId_fkey`;

-- DropIndex
DROP INDEX `User_googleId_key` ON `User`;

-- AlterTable
ALTER TABLE `Customer` DROP COLUMN `userId`;

-- AlterTable
ALTER TABLE `Document` DROP COLUMN `userId`;

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `userId`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `cliannaFolderId`,
    DROP COLUMN `googleId`,
    DROP COLUMN `refreshToken`;
