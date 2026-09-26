ALTER TABLE storage.categories DROP CONSTRAINT IF EXISTS "storage.categories_uq";
CREATE UNIQUE INDEX IF NOT EXISTS categories_name_type_idx ON storage.categories (name, type);
