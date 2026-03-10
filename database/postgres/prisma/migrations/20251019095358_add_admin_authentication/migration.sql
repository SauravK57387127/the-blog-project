/*
  Warnings:

  - Added the required column `deviceId` to the `AdminRefreshToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `AdminRefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "AdminRefreshToken_expiresAt_idx";

-- AlterTable
ALTER TABLE "AdminRefreshToken" ADD COLUMN     "deviceId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "AdminRefreshToken_deviceId_idx" ON "AdminRefreshToken"("deviceId");

-- CreateIndex
CREATE INDEX "AdminRefreshToken_adminId_deviceId_idx" ON "AdminRefreshToken"("adminId", "deviceId");
