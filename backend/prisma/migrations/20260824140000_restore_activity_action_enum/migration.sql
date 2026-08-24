-- The query engine still emits CAST(... AS "ActivityAction"). Recreate the type
-- so inserts and listing work again after the previous TEXT conversion.
CREATE TYPE "ActivityAction" AS ENUM (
  'cafe_created',
  'cafe_activated',
  'cafe_deactivated',
  'cafe_password_reset',
  'cafe_updated',
  'auth_login',
  'auth_login_failed',
  'auth_password_changed',
  'product_created',
  'product_updated',
  'product_deleted',
  'product_availability',
  'category_created',
  'category_updated',
  'category_deleted'
);

ALTER TABLE "ActivityLog"
  ALTER COLUMN "action" TYPE "ActivityAction"
  USING "action"::"ActivityAction";
