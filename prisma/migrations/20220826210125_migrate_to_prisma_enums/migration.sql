/*
  Warnings:

  - You are about to alter the column `shippingType` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum("Order_shippingType")`.
  - You are about to alter the column `taxes` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum("Order_taxes")`.
  - You are about to alter the column `type` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum("Order_type")`.
  - You are about to alter the column `specification` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum("Order_specification")`.
  - Made the column `creationDate` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pending` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Order` MODIFY `creationDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `pending` BOOLEAN NOT NULL,
    MODIFY `shippingType` ENUM('Send', 'Collect', 'Visit') NULL,
    MODIFY `taxes` ENUM('Nineteen', 'Seven') NULL,
    MODIFY `type` ENUM('Einlagen', 'Einlagenarbeiten', 'Abrolloptimierung', 'Schuharbeiten', 'Massschuhleisten', 'Massschuhe', 'Schuhbestellung', 'Miscellaneous') NULL,
    MODIFY `specification` ENUM('Sport', 'Business', 'Casual', 'Workwear', 'Massschuhe', 'SchuhleistenEinleisten', 'Erstlieferung', 'Nachlieferung') NULL;
