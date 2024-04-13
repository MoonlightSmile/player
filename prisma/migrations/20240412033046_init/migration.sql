-- DropForeignKey
ALTER TABLE "Rss" DROP CONSTRAINT "Rss_seriesId_fkey";

-- AlterTable
ALTER TABLE "Rss" ALTER COLUMN "seriesId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Rss" ADD CONSTRAINT "Rss_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE SET NULL ON UPDATE CASCADE;
