/*
  Warnings:

  - You are about to drop the column `googleScope` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `googleScope`,
    ADD COLUMN `gapiAccess` BOOLEAN NOT NULL DEFAULT false;
