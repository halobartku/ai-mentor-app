-- CreateTable
CREATE TABLE "UserPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "learningStyle" TEXT,
    "communicationStyle" TEXT,
    "interests" TEXT[],
    "focusAreas" TEXT[],
    "goalPreferences" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningBehavior" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "preferredTimeOfDay" TEXT,
    "averageSessionDuration" DOUBLE PRECISION,
    "completionPatterns" JSONB,
    "responseToFeedback" TEXT,
    "lastActivityAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningBehavior_pkey" PRIMARY KEY ("id")
);

-- AddColumn
ALTER TABLE "Goal" ADD COLUMN "category" TEXT;
ALTER TABLE "Goal" ADD COLUMN "priority" TEXT DEFAULT 'medium';
ALTER TABLE "Goal" ADD COLUMN "tags" TEXT[];

-- AddColumn
ALTER TABLE "Chat" ADD COLUMN "topic" TEXT;
ALTER TABLE "Chat" ADD COLUMN "context" JSONB;

-- AddColumn
ALTER TABLE "Message" ADD COLUMN "metadata" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_userId_key" ON "UserPreferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LearningBehavior_userId_key" ON "LearningBehavior"("userId");

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningBehavior" ADD CONSTRAINT "LearningBehavior_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;