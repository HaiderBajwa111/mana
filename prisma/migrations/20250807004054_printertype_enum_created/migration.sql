/*
  Warnings:

  - Changed the type of `type` on the `PrinterModel` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."PrinterType" AS ENUM ('FDM', 'SLA');

-- AlterTable
ALTER TABLE "public"."PrinterModel" DROP COLUMN "type",
ADD COLUMN     "type" "public"."PrinterType" NOT NULL;
