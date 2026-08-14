ALTER TABLE storage.transactions
ADD COLUMN IF NOT EXISTS category_name VARCHAR NULL;