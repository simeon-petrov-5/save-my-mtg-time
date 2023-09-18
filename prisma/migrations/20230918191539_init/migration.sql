-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ScrapedEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "cards" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ScrapedEntry" ("cards", "createdAt", "id", "updatedAt", "userId") SELECT "cards", "createdAt", "id", "updatedAt", "userId" FROM "ScrapedEntry";
DROP TABLE "ScrapedEntry";
ALTER TABLE "new_ScrapedEntry" RENAME TO "ScrapedEntry";
CREATE UNIQUE INDEX "ScrapedEntry_userId_key" ON "ScrapedEntry"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
