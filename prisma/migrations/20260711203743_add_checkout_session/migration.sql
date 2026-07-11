-- CreateTable
CREATE TABLE "CheckoutSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "successUrl" TEXT NOT NULL,
    "cancelUrl" TEXT NOT NULL,
    "webhookUrl" TEXT,
    "metadata" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "passId" TEXT,
    "buyerAddress" TEXT,
    "particleTxId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "CheckoutSession_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "AccessItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
