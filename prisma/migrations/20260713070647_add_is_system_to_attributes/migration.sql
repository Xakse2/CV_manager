/*
  Warnings:

  - You are about to drop the column `title` on the `CV` table. All the data in the column will be lost.
  - You are about to drop the `CVAttribute` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `company` to the `Position` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Position` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CVAttribute" DROP CONSTRAINT "CVAttribute_attributeId_fkey";

-- DropForeignKey
ALTER TABLE "CVAttribute" DROP CONSTRAINT "CVAttribute_cvId_fkey";

-- DropForeignKey
ALTER TABLE "CVProject" DROP CONSTRAINT "CVProject_cvId_fkey";

-- AlterTable
ALTER TABLE "Attribute" ADD COLUMN     "isSystem" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "CV" DROP COLUMN "title",
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Position" ADD COLUMN     "company" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "salaryFrom" INTEGER,
ADD COLUMN     "salaryTo" INTEGER;

-- DropTable
DROP TABLE "CVAttribute";

-- CreateTable
CREATE TABLE "PositionAccessRule" (
    "id" TEXT NOT NULL,
    "positionId" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "PositionAccessRule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CVProject" ADD CONSTRAINT "CVProject_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "CV"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionAccessRule" ADD CONSTRAINT "PositionAccessRule_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionAccessRule" ADD CONSTRAINT "PositionAccessRule_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE CASCADE ON UPDATE CASCADE;
