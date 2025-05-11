CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    tags TEXT[],
    category TEXT DEFAULT 'Low'
);
