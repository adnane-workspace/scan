-- Convert sectionKey from fixed enum to free-form slug text
ALTER TABLE "Category" ALTER COLUMN "sectionKey" TYPE TEXT USING ("sectionKey"::text);
ALTER TABLE "Category" ALTER COLUMN "sectionKey" TYPE VARCHAR(40);
DROP TYPE IF EXISTS "MenuSectionKey";
