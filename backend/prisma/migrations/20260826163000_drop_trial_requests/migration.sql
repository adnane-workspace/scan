-- DropTable
DROP TABLE IF EXISTS "TrialRequest";

-- DropEnum
DROP TYPE IF EXISTS "TrialRequestStatus";

-- Remove trial activity logs (enum values remain; PostgreSQL cannot drop enum values easily)
DELETE FROM "ActivityLog" WHERE "action" IN ('trial_requested', 'trial_approved', 'trial_rejected');
