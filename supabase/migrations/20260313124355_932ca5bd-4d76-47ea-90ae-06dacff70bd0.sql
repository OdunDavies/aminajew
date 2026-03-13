
ALTER TYPE product_category RENAME TO product_collection;
ALTER TABLE products RENAME COLUMN category TO collection;
