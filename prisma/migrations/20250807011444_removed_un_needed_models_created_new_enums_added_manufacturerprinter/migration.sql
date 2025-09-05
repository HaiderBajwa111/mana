/*
  Warnings:

  - You are about to drop the column `paymentStatusId` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `statusId` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the `PrinterModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `certifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `creator_preferred_materials` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `manufacturer_certifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `materials` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment_statuses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project_statuses` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."PrinterStatus" AS ENUM ('AVAILABLE', 'BUSY');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "public"."ProjectStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."Material" AS ENUM ('PLA', 'ABS', 'PETG', 'TPU', 'RESIN', 'NYLON', 'CARBON_FIBER', 'METAL', 'WOOD', 'CERAMIC');

-- DropForeignKey
ALTER TABLE "public"."PrinterModel" DROP CONSTRAINT "PrinterModel_brandId_fkey";

-- DropForeignKey
ALTER TABLE "public"."creator_preferred_materials" DROP CONSTRAINT "creator_preferred_materials_creatorProfileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."creator_preferred_materials" DROP CONSTRAINT "creator_preferred_materials_materialId_fkey";

-- DropForeignKey
ALTER TABLE "public"."manufacturer_certifications" DROP CONSTRAINT "manufacturer_certifications_certificationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."manufacturer_certifications" DROP CONSTRAINT "manufacturer_certifications_manufacturerProfileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."projects" DROP CONSTRAINT "projects_paymentStatusId_fkey";

-- DropForeignKey
ALTER TABLE "public"."projects" DROP CONSTRAINT "projects_statusId_fkey";

-- DropIndex
DROP INDEX "public"."projects_paymentStatusId_idx";

-- DropIndex
DROP INDEX "public"."projects_statusId_idx";

-- AlterTable
ALTER TABLE "public"."projects" DROP COLUMN "paymentStatusId",
DROP COLUMN "statusId",
ADD COLUMN     "paymentStatus" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "status" "public"."ProjectStatus" NOT NULL DEFAULT 'SUBMITTED';

-- DropTable
DROP TABLE "public"."PrinterModel";

-- DropTable
DROP TABLE "public"."certifications";

-- DropTable
DROP TABLE "public"."creator_preferred_materials";

-- DropTable
DROP TABLE "public"."manufacturer_certifications";

-- DropTable
DROP TABLE "public"."materials";

-- DropTable
DROP TABLE "public"."payment_statuses";

-- DropTable
DROP TABLE "public"."project_statuses";

-- CreateTable
CREATE TABLE "public"."printer_models" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "buildVolume" TEXT NOT NULL,
    "type" "public"."PrinterType" NOT NULL,
    "brandId" INTEGER NOT NULL,

    CONSTRAINT "printer_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."manufacturer_printers" (
    "id" SERIAL NOT NULL,
    "printerModelId" INTEGER NOT NULL,
    "manufacturerProfileId" INTEGER NOT NULL,
    "customName" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "status" "public"."PrinterStatus" NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "manufacturer_printers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "manufacturer_printers_printerModelId_idx" ON "public"."manufacturer_printers"("printerModelId");

-- CreateIndex
CREATE INDEX "manufacturer_printers_manufacturerProfileId_idx" ON "public"."manufacturer_printers"("manufacturerProfileId");

-- CreateIndex
CREATE INDEX "projects_status_idx" ON "public"."projects"("status");

-- CreateIndex
CREATE INDEX "projects_paymentStatus_idx" ON "public"."projects"("paymentStatus");

-- AddForeignKey
ALTER TABLE "public"."printer_models" ADD CONSTRAINT "printer_models_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "public"."Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manufacturer_printers" ADD CONSTRAINT "manufacturer_printers_printerModelId_fkey" FOREIGN KEY ("printerModelId") REFERENCES "public"."printer_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manufacturer_printers" ADD CONSTRAINT "manufacturer_printers_manufacturerProfileId_fkey" FOREIGN KEY ("manufacturerProfileId") REFERENCES "public"."manufacturer_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
