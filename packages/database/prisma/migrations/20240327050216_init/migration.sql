-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELED');

-- CreateEnum
CREATE TYPE "PollStatus" AS ENUM ('NONE', 'OPEN', 'CLOSED', 'CANCELED');

-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('YES', 'NO', 'ABSTAIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ethAddress" TEXT NOT NULL,
    "telegramUsername" TEXT NOT NULL,
    "twitterUsername" TEXT,
    "name" TEXT,
    "image" TEXT,
    "location" TEXT,
    "hobbies" TEXT,
    "currentCompany" TEXT,
    "currentRole" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "bipId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "status" "ProposalStatus" NOT NULL DEFAULT 'PENDING',
    "link" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Poll" (
    "id" TEXT NOT NULL,
    "pollStatus" "PollStatus" NOT NULL DEFAULT 'NONE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "proposalId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Poll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PollTelegramMessage" (
    "id" TEXT NOT NULL,
    "chatId" TEXT,
    "messageId" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,

    CONSTRAINT "PollTelegramMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "voteType" "VoteType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserRole" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_RolePermission" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_ethAddress_key" ON "User"("ethAddress");

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramUsername_key" ON "User"("telegramUsername");

-- CreateIndex
CREATE UNIQUE INDEX "Proposal_bipId_key" ON "Proposal"("bipId");

-- CreateIndex
CREATE INDEX "Poll_proposalId_idx" ON "Poll"("proposalId");

-- CreateIndex
CREATE INDEX "Poll_createdById_idx" ON "Poll"("createdById");

-- CreateIndex
CREATE INDEX "PollTelegramMessage_pollId_idx" ON "PollTelegramMessage"("pollId");

-- CreateIndex
CREATE UNIQUE INDEX "PollTelegramMessage_chatId_messageId_key" ON "PollTelegramMessage"("chatId", "messageId");

-- CreateIndex
CREATE INDEX "Vote_userId_idx" ON "Vote"("userId");

-- CreateIndex
CREATE INDEX "Vote_pollId_idx" ON "Vote"("pollId");

-- CreateIndex
CREATE UNIQUE INDEX "_UserRole_AB_unique" ON "_UserRole"("A", "B");

-- CreateIndex
CREATE INDEX "_UserRole_B_index" ON "_UserRole"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RolePermission_AB_unique" ON "_RolePermission"("A", "B");

-- CreateIndex
CREATE INDEX "_RolePermission_B_index" ON "_RolePermission"("B");
