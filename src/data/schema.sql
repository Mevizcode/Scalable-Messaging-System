-- DROP DATABASE IF EXISTS messaging_db;

CREATE DATABASE messaging_db
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Chinese (Simplified)_China.1252'
    LC_CTYPE = 'Chinese (Simplified)_China.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS groups (
    group_id SERIAL PRIMARY KEY,
    group_name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    message_id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NULL,
    group_id INT NULL, 
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups (group_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages_status (
    message_status_id SERIAL PRIMARY KEY,
    message_id INT NULL,
    status VARCHAR(20) NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages (message_id) ON DELETE CASCADE
);

-- fetch messages with pagination, ordering and date range filtering query
SELECT * FROM messages
                WHERE (sender_id = $1 AND receiver_id = $2)
                OR (sender_id = $2 AND receiver_id = $1)
             AND timestamp >= $3 AND timestamp < $4
            ORDER BY timestamp DESC
            LIMIT $5
            OFFSET $6

-- fetch group messages

SELECT * FROM messages WHERE group_id = $1 AND timestamp >= $2 AND timestamp < $3 
            ORDER BY timestamp DESC
            LIMIT $4
            OFFSET $5

-- add users and groups
BEGIN;

INSERT INTO groups (group_name) 
VALUES 
    ('group-A'), 
    ('group-B'), 
    ('group-C');

INSERT INTO users (username) 
VALUES 
    ('dave'), 
    ('test'), 
    ('sam'), 
    ('roy'), 
    ('john');

COMMIT;