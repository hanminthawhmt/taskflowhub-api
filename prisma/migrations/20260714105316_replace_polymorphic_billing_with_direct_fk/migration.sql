/*
  Warnings:

  - You are about to drop the column `bill_id` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `bill_type` on the `subscriptions` table. All the data in the column will be lost.
  - Added the required column `company_id` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `companies` ADD COLUMN `plan_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `subscriptions` DROP COLUMN `bill_id`,
    DROP COLUMN `bill_type`,
    ADD COLUMN `company_id` INTEGER NOT NULL,
    ADD COLUMN `plan_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `companies` ADD CONSTRAINT `companies_plan_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `plans`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_plan_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `plans`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
