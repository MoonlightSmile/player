/*
  Warnings:

  - You are about to drop the column `whsiperUrl` on the `Episode` table. All the data in the column will be lost.
  - Added the required column `whisperUrl` to the `Episode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Episode" DROP COLUMN "whsiperUrl",
ADD COLUMN     "whisperUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Rss" ADD COLUMN     "latestFileUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "name" TEXT NOT NULL DEFAULT '';
