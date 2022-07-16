/*
  Warnings:

  - You are about to alter the column `type` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Order` ADD COLUMN `detailType` INTEGER NULL,
    MODIFY `type` INTEGER NULL;
