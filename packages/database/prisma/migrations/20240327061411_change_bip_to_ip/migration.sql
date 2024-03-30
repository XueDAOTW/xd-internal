/*
  Warnings:

  - You are about to drop the column `bipId` on the `Proposal` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ipId]` on the table `Proposal` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ipId` to the `Proposal` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Proposal_bipId_key";

-- AlterTable
ALTER TABLE "Proposal" DROP COLUMN "bipId",
ADD COLUMN     "ipId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Proposal_ipId_key" ON "Proposal"("ipId");
