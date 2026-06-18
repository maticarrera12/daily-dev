ALTER TABLE habits ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;

UPDATE habits SET sort_order = id;
