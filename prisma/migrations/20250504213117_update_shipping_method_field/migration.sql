-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "shippingMethod" DROP NOT NULL,
ALTER COLUMN "shippingMethod" DROP DEFAULT;
