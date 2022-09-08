/*
  Warnings:

  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[googleId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Account` DROP FOREIGN KEY `Account_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Session` DROP FOREIGN KEY `Session_userId_fkey`;

-- AlterTable
ALTER TABLE `Customer` MODIFY `disabled` BOOLEAN NULL,
    MODIFY `whatsapp` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `Order` ALTER COLUMN `pending` DROP DEFAULT;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `emailVerified`,
    DROP COLUMN `image`,
    DROP COLUMN `name`,
    ADD COLUMN `gapiAccess` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `googleId` VARCHAR(191) NULL,
    ADD COLUMN `refreshToken` TEXT NULL,
    MODIFY `email` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Account`;

-- DropTable
DROP TABLE `Session`;

-- DropTable
DROP TABLE `VerificationToken`;

-- CreateIndex
CREATE UNIQUE INDEX `User_googleId_key` ON `User`(`googleId`);
