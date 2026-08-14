-- Убираем foreign key constraints
ALTER TABLE relations.category_tree DROP CONSTRAINT IF EXISTS fk_category_tree_user;
ALTER TABLE relations.category_tree DROP CONSTRAINT IF EXISTS fk_category_tree_category;
ALTER TABLE relations.category_tree DROP CONSTRAINT IF EXISTS fk_category_tree_parent;

-- Убираем старые индексы
DROP INDEX IF EXISTS relations.idx_category_tree_user;
DROP INDEX IF EXISTS relations.idx_category_tree_parent;

-- Убираем составной primary key
ALTER TABLE relations.category_tree DROP CONSTRAINT IF EXISTS pk_category_tree;

-- Добавляем колонку id (если ещё нет)
ALTER TABLE relations.category_tree ADD COLUMN IF NOT EXISTS id UUID DEFAULT uuid_generate_v4();

-- Делаем id primary key
ALTER TABLE relations.category_tree ADD PRIMARY KEY (id);

-- Добавляем составной уникальный индекс (user_id, category_id) как в коде
CREATE UNIQUE INDEX IF NOT EXISTS category_tree_user_category_idx ON relations.category_tree (user_id, category_id);
