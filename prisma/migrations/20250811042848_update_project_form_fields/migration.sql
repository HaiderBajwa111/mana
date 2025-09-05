/*
  Warnings:

  - Added the required column `color` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finish` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `material` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resolution` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."projects" ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "customColor" TEXT,
ADD COLUMN     "deadline" TIMESTAMPTZ(6),
ADD COLUMN     "designNotes" TEXT,
ADD COLUMN     "finish" TEXT NOT NULL,
ADD COLUMN     "infill" INTEGER NOT NULL DEFAULT 20,
ADD COLUMN     "infillPattern" TEXT NOT NULL DEFAULT 'grid',
ADD COLUMN     "material" "public"."Material" NOT NULL,
ADD COLUMN     "referenceImageUrl" TEXT,
ADD COLUMN     "resolution" TEXT NOT NULL,
ADD COLUMN     "scale" INTEGER NOT NULL DEFAULT 100;
