/*
  Warnings:

  - You are about to drop the column `eventType` on the `analytics_events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "analytics_events" DROP COLUMN "eventType",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'VIEW';

-- AlterTable
ALTER TABLE "invitations" ADD COLUMN     "backgroundMusic" TEXT,
ADD COLUMN     "brideName" TEXT,
ADD COLUMN     "customCss" TEXT,
ADD COLUMN     "groomName" TEXT,
ADD COLUMN     "venue" TEXT,
ADD COLUMN     "weddingDate" TIMESTAMP(3),
ALTER COLUMN "configJson" SET DEFAULT '{}';
