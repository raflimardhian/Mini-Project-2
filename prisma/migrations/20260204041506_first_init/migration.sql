-- CreateEnum
CREATE TYPE "CommissionType" AS ENUM ('EARNED', 'PENDING');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'OWNER', 'RESELLER', 'BUYER');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('COMPLETED', 'PAID', 'UNPAID');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "balanceCommission" INTEGER NOT NULL DEFAULT 0,
    "role" "Role" NOT NULL DEFAULT 'BUYER',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "otp" TEXT,
    "otpExpiredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "basePrice" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "ownerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResellerProduct" (
    "id" SERIAL NOT NULL,
    "resellerId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "basePrice" INTEGER NOT NULL,
    "sellingPrice" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResellerProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "buyerId" INTEGER NOT NULL,
    "resellerProductId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "sellingPrice" INTEGER NOT NULL,
    "basePrice" INTEGER NOT NULL,
    "resellerCommission" INTEGER NOT NULL,
    "paymentMethod" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'UNPAID',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommissionLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" "CommissionType" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommissionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Etalase" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "resellerId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startAt" TIMESTAMP(3),
    "endAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Etalase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EtalaseProduct" (
    "id" SERIAL NOT NULL,
    "etalaseId" INTEGER NOT NULL,
    "resellerProductId" INTEGER NOT NULL,

    CONSTRAINT "EtalaseProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EtalaseProduct_etalaseId_resellerProductId_key" ON "EtalaseProduct"("etalaseId", "resellerProductId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResellerProduct" ADD CONSTRAINT "ResellerProduct_resellerId_fkey" FOREIGN KEY ("resellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResellerProduct" ADD CONSTRAINT "ResellerProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_resellerProductId_fkey" FOREIGN KEY ("resellerProductId") REFERENCES "ResellerProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommissionLog" ADD CONSTRAINT "CommissionLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommissionLog" ADD CONSTRAINT "CommissionLog_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etalase" ADD CONSTRAINT "Etalase_resellerId_fkey" FOREIGN KEY ("resellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EtalaseProduct" ADD CONSTRAINT "EtalaseProduct_etalaseId_fkey" FOREIGN KEY ("etalaseId") REFERENCES "Etalase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EtalaseProduct" ADD CONSTRAINT "EtalaseProduct_resellerProductId_fkey" FOREIGN KEY ("resellerProductId") REFERENCES "ResellerProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
