/*
  Warnings:

  - You are about to drop the column `shippingAddressId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `featured` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `StreetAddress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderId` to the `StreetAddress` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_shippingAddressId_fkey";

-- DropIndex
DROP INDEX "Order_shippingAddressId_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "shippingAddressId";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "featured",
DROP COLUMN "stock",
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "StreetAddress" ADD COLUMN     "orderId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StreetAddress_orderId_key" ON "StreetAddress"("orderId");

-- AddForeignKey
ALTER TABLE "StreetAddress" ADD CONSTRAINT "StreetAddress_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
