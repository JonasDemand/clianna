/*
  Warnings:

  - You are about to drop the column `picture` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[googleId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `picture`,
    ADD COLUMN `googleId` VARCHAR(191) NULL,
    ADD COLUMN `password` TEXT NULL,
    ADD COLUMN `salt` TEXT NULL,
    MODIFY `email` VARCHAR(191) NULL,
    MODIFY `googleToken` TEXT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_googleId_key` ON `User`(`googleId`);
