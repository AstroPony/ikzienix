-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "estimatedDelivery" TIMESTAMP(3),
ADD COLUMN     "shippingCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "shippingMethod" TEXT NOT NULL DEFAULT 'standard',
ADD COLUMN     "trackingNumber" TEXT;

-- CreateTable
CREATE TABLE "StreetAddress" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "line1" TEXT NOT NULL,
    "line2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'US',
    "phone" TEXT,
    "email" TEXT,

    CONSTRAINT "StreetAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StreetAddress_orderId_key" ON "StreetAddress"("orderId");

-- AddForeignKey
ALTER TABLE "StreetAddress" ADD CONSTRAINT "StreetAddress_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
