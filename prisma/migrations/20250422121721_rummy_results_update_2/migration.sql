/*
  Warnings:

  - You are about to drop the column `data` on the `RummyResult` table. All the data in the column will be lost.
  - Added the required column `date` to the `RummyResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `round` to the `RummyResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scores` to the `RummyResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RummyResult" DROP COLUMN "data",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "round" INTEGER NOT NULL,
ADD COLUMN     "scores" JSONB NOT NULL;
