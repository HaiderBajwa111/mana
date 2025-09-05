/*
  Warnings:

  - The primary key for the `conversations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `creator_profiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `creatorType` column on the `creator_profiles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `accountType` column on the `creator_profiles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `creator_stripe_accounts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `file_attachments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `manufacturer_printers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `manufacturer_profiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `manufacturer_stripe_accounts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `messages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `projects` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `sample_work_photos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `projectId` column on the `sample_work_photos` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `user_photos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `default_role` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `Brand` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[stripeCustomerId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `conversations` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `conversations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `projectId` on the `conversations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `creator_profiles` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `creator_profiles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `canPickupLocally` on table `creator_profiles` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `id` on the `creator_stripe_accounts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `stripeAccountEnabled` on table `creator_stripe_accounts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `stripeAccountOnboardingComplete` on table `creator_stripe_accounts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `creator_stripe_accounts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `creator_stripe_accounts` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `id` on the `file_attachments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `messageId` on the `file_attachments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `createdAt` on table `file_attachments` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `id` on the `manufacturer_printers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `manufacturerProfileId` on the `manufacturer_printers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `updatedAt` on table `manufacturer_printers` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `manufacturer_profiles` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `manufacturer_profiles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `country` on table `manufacturer_profiles` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `id` on the `manufacturer_stripe_accounts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `stripeAccountEnabled` on table `manufacturer_stripe_accounts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `stripeAccountOnboardingComplete` on table `manufacturer_stripe_accounts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `manufacturer_stripe_accounts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `manufacturer_stripe_accounts` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `messages` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `conversationId` on the `messages` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `isRead` on table `messages` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `messages` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `printer_models` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `projects` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `updatedAt` on table `projects` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `sample_work_photos` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `sample_work_photos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `createdAt` on table `sample_work_photos` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `user_photos` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `user_photos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `photoType` on the `user_photos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `createdAt` on table `user_photos` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdAt` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `onboardingCompleted` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."QuoteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "public"."CreatorType" AS ENUM ('HOBBYIST', 'PROFESSIONAL', 'STUDENT', 'BUSINESS');

-- CreateEnum
CREATE TYPE "public"."AccountType" AS ENUM ('INDIVIDUAL', 'BUSINESS', 'CORPORATION');

-- CreateEnum
CREATE TYPE "public"."PhotoType" AS ENUM ('PROFILE', 'PORTFOLIO', 'SAMPLE_WORK', 'REFERENCE');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."Material" ADD VALUE 'POLYCARBONATE';
ALTER TYPE "public"."Material" ADD VALUE 'FLEXIBLE';

-- AlterEnum
ALTER TYPE "public"."PaymentStatus" ADD VALUE 'PARTIALLY_REFUNDED';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."PrinterStatus" ADD VALUE 'MAINTENANCE';
ALTER TYPE "public"."PrinterStatus" ADD VALUE 'OFFLINE';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."PrinterType" ADD VALUE 'SLS';
ALTER TYPE "public"."PrinterType" ADD VALUE 'DLP';
ALTER TYPE "public"."PrinterType" ADD VALUE 'POLYJET';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."ProjectStatus" ADD VALUE 'QUOTED';
ALTER TYPE "public"."ProjectStatus" ADD VALUE 'APPROVED';
ALTER TYPE "public"."ProjectStatus" ADD VALUE 'ON_HOLD';

-- DropForeignKey
ALTER TABLE "public"."conversations" DROP CONSTRAINT "conversations_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."creator_profiles" DROP CONSTRAINT "creator_profiles_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."creator_stripe_accounts" DROP CONSTRAINT "creator_stripe_accounts_creatorProfileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."file_attachments" DROP CONSTRAINT "file_attachments_messageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."file_attachments" DROP CONSTRAINT "file_attachments_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."manufacturer_printers" DROP CONSTRAINT "manufacturer_printers_manufacturerProfileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."manufacturer_profiles" DROP CONSTRAINT "manufacturer_profiles_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."manufacturer_stripe_accounts" DROP CONSTRAINT "manufacturer_stripe_accounts_manufacturerProfileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."messages" DROP CONSTRAINT "messages_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."messages" DROP CONSTRAINT "messages_senderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."printer_models" DROP CONSTRAINT "printer_models_brandId_fkey";

-- DropForeignKey
ALTER TABLE "public"."projects" DROP CONSTRAINT "projects_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."projects" DROP CONSTRAINT "projects_manufacturerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."sample_work_photos" DROP CONSTRAINT "sample_work_photos_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_photos" DROP CONSTRAINT "user_photos_userId_fkey";

-- AlterTable
ALTER TABLE "public"."conversations" DROP CONSTRAINT "conversations_pkey",
ADD COLUMN     "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMPTZ(6) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "projectId",
ADD COLUMN     "projectId" UUID NOT NULL,
ALTER COLUMN "title" SET DATA TYPE TEXT,
ADD CONSTRAINT "conversations_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."creator_profiles" DROP CONSTRAINT "creator_profiles_pkey",
ADD COLUMN     "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMPTZ(6) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "location" SET DATA TYPE TEXT,
ALTER COLUMN "canPickupLocally" SET NOT NULL,
DROP COLUMN "creatorType",
ADD COLUMN     "creatorType" "public"."CreatorType" NOT NULL DEFAULT 'HOBBYIST',
DROP COLUMN "accountType",
ADD COLUMN     "accountType" "public"."AccountType" NOT NULL DEFAULT 'INDIVIDUAL',
ALTER COLUMN "businessName" SET DATA TYPE TEXT,
ALTER COLUMN "portfolioLink" SET DATA TYPE TEXT,
ADD CONSTRAINT "creator_profiles_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."creator_stripe_accounts" DROP CONSTRAINT "creator_stripe_accounts_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "stripeAccountEnabled" SET NOT NULL,
ALTER COLUMN "stripeAccountOnboardingComplete" SET NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL,
ADD CONSTRAINT "creator_stripe_accounts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."file_attachments" DROP CONSTRAINT "file_attachments_pkey",
ADD COLUMN     "mimeType" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "messageId",
ADD COLUMN     "messageId" UUID NOT NULL,
ALTER COLUMN "fileName" SET DATA TYPE TEXT,
ALTER COLUMN "fileType" SET DATA TYPE TEXT,
ALTER COLUMN "createdAt" SET NOT NULL,
ADD CONSTRAINT "file_attachments_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."manufacturer_printers" DROP CONSTRAINT "manufacturer_printers_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "manufacturerProfileId",
ADD COLUMN     "manufacturerProfileId" UUID NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL,
ADD CONSTRAINT "manufacturer_printers_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."manufacturer_profiles" DROP CONSTRAINT "manufacturer_profiles_pkey",
ADD COLUMN     "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMPTZ(6) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "businessName" SET DATA TYPE TEXT,
ALTER COLUMN "country" SET NOT NULL,
ADD CONSTRAINT "manufacturer_profiles_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."manufacturer_stripe_accounts" DROP CONSTRAINT "manufacturer_stripe_accounts_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "stripeAccountEnabled" SET NOT NULL,
ALTER COLUMN "stripeAccountOnboardingComplete" SET NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL,
ADD CONSTRAINT "manufacturer_stripe_accounts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."messages" DROP CONSTRAINT "messages_pkey",
ADD COLUMN     "updatedAt" TIMESTAMPTZ(6) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "conversationId",
ADD COLUMN     "conversationId" UUID NOT NULL,
ALTER COLUMN "isRead" SET NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL,
ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."printer_models" ADD COLUMN     "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMPTZ(6) NOT NULL;

-- AlterTable
ALTER TABLE "public"."projects" DROP CONSTRAINT "projects_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL,
ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."sample_work_photos" DROP CONSTRAINT "sample_work_photos_pkey",
ADD COLUMN     "updatedAt" TIMESTAMPTZ(6) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "projectId",
ADD COLUMN     "projectId" UUID,
ALTER COLUMN "fileName" SET DATA TYPE TEXT,
ALTER COLUMN "mimeType" SET DATA TYPE TEXT,
ALTER COLUMN "createdAt" SET NOT NULL,
ADD CONSTRAINT "sample_work_photos_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."user_photos" DROP CONSTRAINT "user_photos_pkey",
ADD COLUMN     "updatedAt" TIMESTAMPTZ(6) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "photoType",
ADD COLUMN     "photoType" "public"."PhotoType" NOT NULL,
ALTER COLUMN "fileName" SET DATA TYPE TEXT,
ALTER COLUMN "mimeType" SET DATA TYPE TEXT,
ALTER COLUMN "createdAt" SET NOT NULL,
ADD CONSTRAINT "user_photos_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "default_role",
ADD COLUMN     "defaultRole" TEXT,
ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMPTZ(6) NOT NULL,
ALTER COLUMN "username" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "firstName" SET DATA TYPE TEXT,
ALTER COLUMN "lastName" SET DATA TYPE TEXT,
ALTER COLUMN "onboardingCompleted" SET NOT NULL;

-- DropTable
DROP TABLE "public"."Brand";

-- CreateTable
CREATE TABLE "public"."brands" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quotes" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "manufacturerId" UUID NOT NULL,
    "creatorId" UUID NOT NULL,
    "manufacturerProfileId" UUID NOT NULL,
    "status" "public"."QuoteStatus" NOT NULL DEFAULT 'PENDING',
    "price" DECIMAL(10,2) NOT NULL,
    "notes" TEXT,
    "estimatedDeliveryDays" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_key" ON "public"."brands"("name");

-- CreateIndex
CREATE INDEX "brands_name_idx" ON "public"."brands"("name");

-- CreateIndex
CREATE INDEX "quotes_projectId_idx" ON "public"."quotes"("projectId");

-- CreateIndex
CREATE INDEX "quotes_manufacturerId_idx" ON "public"."quotes"("manufacturerId");

-- CreateIndex
CREATE INDEX "quotes_creatorId_idx" ON "public"."quotes"("creatorId");

-- CreateIndex
CREATE INDEX "quotes_manufacturerProfileId_idx" ON "public"."quotes"("manufacturerProfileId");

-- CreateIndex
CREATE INDEX "quotes_status_idx" ON "public"."quotes"("status");

-- CreateIndex
CREATE INDEX "quotes_price_idx" ON "public"."quotes"("price");

-- CreateIndex
CREATE INDEX "quotes_createdAt_idx" ON "public"."quotes"("createdAt");

-- CreateIndex
CREATE INDEX "conversations_projectId_idx" ON "public"."conversations"("projectId");

-- CreateIndex
CREATE INDEX "conversations_createdAt_idx" ON "public"."conversations"("createdAt");

-- CreateIndex
CREATE INDEX "creator_profiles_creatorType_idx" ON "public"."creator_profiles"("creatorType");

-- CreateIndex
CREATE INDEX "creator_profiles_location_idx" ON "public"."creator_profiles"("location");

-- CreateIndex
CREATE INDEX "creator_stripe_accounts_stripeAccountId_idx" ON "public"."creator_stripe_accounts"("stripeAccountId");

-- CreateIndex
CREATE INDEX "file_attachments_messageId_idx" ON "public"."file_attachments"("messageId");

-- CreateIndex
CREATE INDEX "file_attachments_fileType_idx" ON "public"."file_attachments"("fileType");

-- CreateIndex
CREATE INDEX "file_attachments_createdAt_idx" ON "public"."file_attachments"("createdAt");

-- CreateIndex
CREATE INDEX "manufacturer_printers_manufacturerProfileId_idx" ON "public"."manufacturer_printers"("manufacturerProfileId");

-- CreateIndex
CREATE INDEX "manufacturer_printers_status_idx" ON "public"."manufacturer_printers"("status");

-- CreateIndex
CREATE INDEX "manufacturer_printers_createdAt_idx" ON "public"."manufacturer_printers"("createdAt");

-- CreateIndex
CREATE INDEX "manufacturer_profiles_businessName_idx" ON "public"."manufacturer_profiles"("businessName");

-- CreateIndex
CREATE INDEX "manufacturer_profiles_city_idx" ON "public"."manufacturer_profiles"("city");

-- CreateIndex
CREATE INDEX "manufacturer_profiles_state_idx" ON "public"."manufacturer_profiles"("state");

-- CreateIndex
CREATE INDEX "manufacturer_profiles_country_idx" ON "public"."manufacturer_profiles"("country");

-- CreateIndex
CREATE INDEX "manufacturer_stripe_accounts_stripeAccountId_idx" ON "public"."manufacturer_stripe_accounts"("stripeAccountId");

-- CreateIndex
CREATE INDEX "messages_conversationId_idx" ON "public"."messages"("conversationId");

-- CreateIndex
CREATE INDEX "messages_isRead_idx" ON "public"."messages"("isRead");

-- CreateIndex
CREATE INDEX "messages_createdAt_idx" ON "public"."messages"("createdAt");

-- CreateIndex
CREATE INDEX "printer_models_brandId_idx" ON "public"."printer_models"("brandId");

-- CreateIndex
CREATE INDEX "printer_models_type_idx" ON "public"."printer_models"("type");

-- CreateIndex
CREATE INDEX "printer_models_name_idx" ON "public"."printer_models"("name");

-- CreateIndex
CREATE INDEX "projects_material_idx" ON "public"."projects"("material");

-- CreateIndex
CREATE INDEX "projects_createdAt_idx" ON "public"."projects"("createdAt");

-- CreateIndex
CREATE INDEX "projects_deadline_idx" ON "public"."projects"("deadline");

-- CreateIndex
CREATE INDEX "sample_work_photos_projectId_idx" ON "public"."sample_work_photos"("projectId");

-- CreateIndex
CREATE INDEX "sample_work_photos_createdAt_idx" ON "public"."sample_work_photos"("createdAt");

-- CreateIndex
CREATE INDEX "user_photos_photoType_idx" ON "public"."user_photos"("photoType");

-- CreateIndex
CREATE INDEX "user_photos_createdAt_idx" ON "public"."user_photos"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripeCustomerId_key" ON "public"."users"("stripeCustomerId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "public"."users"("username");

-- CreateIndex
CREATE INDEX "users_onboardingCompleted_idx" ON "public"."users"("onboardingCompleted");

-- AddForeignKey
ALTER TABLE "public"."creator_profiles" ADD CONSTRAINT "creator_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."creator_stripe_accounts" ADD CONSTRAINT "creator_stripe_accounts_creatorProfileId_fkey" FOREIGN KEY ("creatorProfileId") REFERENCES "public"."creator_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manufacturer_profiles" ADD CONSTRAINT "manufacturer_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manufacturer_stripe_accounts" ADD CONSTRAINT "manufacturer_stripe_accounts_manufacturerProfileId_fkey" FOREIGN KEY ("manufacturerProfileId") REFERENCES "public"."manufacturer_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."printer_models" ADD CONSTRAINT "printer_models_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "public"."brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manufacturer_printers" ADD CONSTRAINT "manufacturer_printers_manufacturerProfileId_fkey" FOREIGN KEY ("manufacturerProfileId") REFERENCES "public"."manufacturer_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."projects" ADD CONSTRAINT "projects_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."projects" ADD CONSTRAINT "projects_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quotes" ADD CONSTRAINT "quotes_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quotes" ADD CONSTRAINT "quotes_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quotes" ADD CONSTRAINT "quotes_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quotes" ADD CONSTRAINT "quotes_manufacturerProfileId_fkey" FOREIGN KEY ("manufacturerProfileId") REFERENCES "public"."manufacturer_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."conversations" ADD CONSTRAINT "conversations_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."file_attachments" ADD CONSTRAINT "file_attachments_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "public"."messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."file_attachments" ADD CONSTRAINT "file_attachments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_photos" ADD CONSTRAINT "user_photos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sample_work_photos" ADD CONSTRAINT "sample_work_photos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
