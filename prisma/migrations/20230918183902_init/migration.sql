-- CreateTable
CREATE TABLE "ScrapedEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "cards" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ScrapedEntry_userId_key" ON "ScrapedEntry"("userId");
