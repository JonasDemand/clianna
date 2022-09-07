/*
  Warnings:

  - You are about to drop the column `googleToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `googleToken`,
    ADD COLUMN `cliannaFolderId` VARCHAR(191) NULL,
    ADD COLUMN `refreshToken` TEXT NULL;
