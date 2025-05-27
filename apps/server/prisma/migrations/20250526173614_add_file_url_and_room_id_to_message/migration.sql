-- AlterTable
ALTER TABLE "message" ADD COLUMN     "fileUrl" TEXT,
ADD COLUMN     "roomId" TEXT,
ALTER COLUMN "text" DROP NOT NULL;
