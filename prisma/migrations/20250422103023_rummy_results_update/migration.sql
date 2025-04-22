/*
  Warnings:

  - You are about to drop the column `date` on the `RummyResult` table. All the data in the column will be lost.
  - Added the required column `data` to the `RummyResult` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "RummyResult_finished_date_idx";

-- AlterTable
ALTER TABLE "RummyResult" DROP COLUMN "date",
ADD COLUMN     "data" JSONB NOT NULL;
