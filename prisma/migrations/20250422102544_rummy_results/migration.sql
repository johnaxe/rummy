-- CreateTable
CREATE TABLE "RummyResult" (
    "id" TEXT NOT NULL,
    "finished" BOOLEAN NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RummyResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RummyResult_finished_date_idx" ON "RummyResult"("finished", "date" DESC);

-- CreateIndex
CREATE INDEX "RummyResult_finished_idx" ON "RummyResult"("finished");
