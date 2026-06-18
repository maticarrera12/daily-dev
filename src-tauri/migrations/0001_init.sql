CREATE TABLE habits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  image_path TEXT NOT NULL,
  created_at TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  current_streak INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE daily_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  habit_id INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  completed INTEGER NOT NULL,
  UNIQUE(habit_id, date)
);

CREATE INDEX idx_daily_records_habit_date ON daily_records(habit_id, date);

CREATE TABLE app_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  last_open_date TEXT NOT NULL
);
