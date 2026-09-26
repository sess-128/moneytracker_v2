UPDATE storage.transactions
SET category_name = cat.name
FROM storage.categories cat
WHERE storage.transactions.category_id = cat.id;