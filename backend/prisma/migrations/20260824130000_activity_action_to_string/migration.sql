ALTER TABLE "ActivityLog" ALTER COLUMN "action" TYPE TEXT USING "action"::text;
DROP TYPE "ActivityAction";
