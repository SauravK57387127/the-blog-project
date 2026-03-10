/*
  Warnings:

  - You are about to drop the `ClickEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ErrorLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PageView` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScrollEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrafficSource` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ClickEvent";

-- DropTable
DROP TABLE "ErrorLog";

-- DropTable
DROP TABLE "PageView";

-- DropTable
DROP TABLE "ScrollEvent";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "TrafficSource";

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "properties" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
