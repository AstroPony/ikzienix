/*
  Warnings:

  - You are about to drop the column `orderId` on the `StreetAddress` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shippingAddressId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `StreetAddress` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `StreetAddress` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `StreetAddress` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "StreetAddress" DROP CONSTRAINT "StreetAddress_orderId_fkey";

-- DropIndex
DROP INDEX "StreetAddress_orderId_key";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shippingAddressId" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "StreetAddress" DROP COLUMN "orderId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "country" DROP DEFAULT,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_shippingAddressId_key" ON "Order"("shippingAddressId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shippingAddressId_fkey" FOREIGN KEY ("shippingAddressId") REFERENCES "StreetAddress"("id") ON DELETE SET NULL ON UPDATE CASCADE;
