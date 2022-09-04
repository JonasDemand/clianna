/*
  Warnings:

  - You are about to drop the column `admin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `salt` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cuid]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - The required column `cuid` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `googleToken` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `picture` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `admin`,
    DROP COLUMN `password`,
    DROP COLUMN `salt`,
    ADD COLUMN `cuid` VARCHAR(191) NOT NULL,
    ADD COLUMN `googleToken` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `picture` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_cuid_key` ON `User`(`cuid`);
