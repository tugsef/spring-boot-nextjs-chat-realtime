--liquibase formatted sql

--changeset focusspark:1 splitStatements:true endDelimiter:;
--comment: Create USERS table
CREATE TABLE IF NOT EXISTS USERS (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    nick_name VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'OFFLINE',
    CONSTRAINT chk_status CHECK (status IN ('ONLINE', 'OFFLINE'))
);
--rollback DROP TABLE IF EXISTS USERS;

--changeset focusspark:2 splitStatements:true endDelimiter:;
--comment: Create CHATGROUP table
CREATE TABLE IF NOT EXISTS CHATGROUP (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    chat_id VARCHAR(255) NOT NULL,
    sender_id BIGINT NOT NULL,
    recipient_id BIGINT NOT NULL,
    CONSTRAINT fk_chatgroup_sender FOREIGN KEY (sender_id) REFERENCES USERS(id) ON DELETE CASCADE,
    CONSTRAINT fk_chatgroup_recipient FOREIGN KEY (recipient_id) REFERENCES USERS(id) ON DELETE CASCADE
);
--rollback DROP TABLE IF EXISTS CHATGROUP;

--changeset focusspark:3 splitStatements:true endDelimiter:;
--comment: Create CHATMESSAGES table
CREATE TABLE IF NOT EXISTS CHATMESSAGES (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    chat_id VARCHAR(255) NOT NULL,
    sender_id BIGINT NOT NULL,
    recipient_id BIGINT NOT NULL,
    content TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_chatmessages_sender FOREIGN KEY (sender_id) REFERENCES USERS(id) ON DELETE CASCADE,
    CONSTRAINT fk_chatmessages_recipient FOREIGN KEY (recipient_id) REFERENCES USERS(id) ON DELETE CASCADE
);
--rollback DROP TABLE IF EXISTS CHATMESSAGES;

--changeset focusspark:4 splitStatements:true endDelimiter:;
--comment: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_nickname ON USERS(nick_name);
CREATE INDEX IF NOT EXISTS idx_users_status ON USERS(status);
CREATE INDEX IF NOT EXISTS idx_chatgroup_chatid ON CHATGROUP(chat_id);
CREATE INDEX IF NOT EXISTS idx_chatgroup_sender ON CHATGROUP(sender_id);
CREATE INDEX IF NOT EXISTS idx_chatgroup_recipient ON CHATGROUP(recipient_id);
CREATE INDEX IF NOT EXISTS idx_chatmessages_chatid ON CHATMESSAGES(chat_id);
CREATE INDEX IF NOT EXISTS idx_chatmessages_sender ON CHATMESSAGES(sender_id);
CREATE INDEX IF NOT EXISTS idx_chatmessages_recipient ON CHATMESSAGES(recipient_id);
CREATE INDEX IF NOT EXISTS idx_chatmessages_timestamp ON CHATMESSAGES(time_stamp);
--rollback DROP INDEX IF EXISTS idx_users_nickname;
--rollback DROP INDEX IF EXISTS idx_users_status;
--rollback DROP INDEX IF EXISTS idx_chatgroup_chatid;
--rollback DROP INDEX IF EXISTS idx_chatgroup_sender;
--rollback DROP INDEX IF EXISTS idx_chatgroup_recipient;
--rollback DROP INDEX IF EXISTS idx_chatmessages_chatid;
--rollback DROP INDEX IF EXISTS idx_chatmessages_sender;
--rollback DROP INDEX IF EXISTS idx_chatmessages_recipient;
--rollback DROP INDEX IF EXISTS idx_chatmessages_timestamp;
