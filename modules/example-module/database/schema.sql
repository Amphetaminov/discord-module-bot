-- Таблица для логирования использования команды /ping
CREATE TABLE IF NOT EXISTS ping_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    username TEXT NOT NULL,
    latency INTEGER NOT NULL,
    timestamp INTEGER NOT NULL
);

-- Индекс для быстрого поиска по пользователю
CREATE INDEX IF NOT EXISTS idx_user_id ON ping_logs(user_id);

-- Индекс для сортировки по времени
CREATE INDEX IF NOT EXISTS idx_timestamp ON ping_logs(timestamp DESC);

