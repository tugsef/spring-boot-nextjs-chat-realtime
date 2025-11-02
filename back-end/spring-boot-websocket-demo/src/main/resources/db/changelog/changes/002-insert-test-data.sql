--liquibase formatted sql

--changeset focusspark:5 splitStatements:true endDelimiter:;
--comment: Insert test users
INSERT INTO USERS (id, firstname, lastname, status, nick_name) VALUES
(1, 'John', 'Doe', 'OFFLINE', 'john.doe'),
(2, 'Jane', 'Smith', 'OFFLINE', 'jane.smith'),
(3, 'Bob', 'Johnson', 'OFFLINE', 'bob.johnson'),
(4, 'Alice', 'Williams', 'OFFLINE', 'alice.williams'),
(5, 'Charlie', 'Brown', 'OFFLINE', 'charlie.brown'),
(6, 'Diana', 'Davis', 'OFFLINE', 'diana.davis');
--rollback DELETE FROM USERS WHERE id IN (1, 2, 3, 4, 5, 6);

--changeset focusspark:6 splitStatements:true endDelimiter:;
--comment: Insert test chat groups
INSERT INTO CHATGROUP (id, chat_id, sender_id, recipient_id) VALUES
-- User 1 conversations
(1, '1_2', 1, 2),
(2, '1_2', 2, 1),
(3, '1_3', 1, 3),
(4, '1_3', 3, 1),
(5, '1_4', 1, 4),
(6, '1_4', 4, 1),
-- User 2 conversations (beyond user 1)
(7, '2_3', 2, 3),
(8, '2_3', 3, 2),
(9, '2_5', 2, 5),
(10, '2_5', 5, 2),
-- User 3 conversations (beyond user 1 and 2)
(11, '3_4', 3, 4),
(12, '3_4', 4, 3),
-- User 4 conversations (beyond existing)
(13, '4_5', 4, 5),
(14, '4_5', 5, 4),
-- User 5 conversations (beyond existing)
(15, '5_6', 5, 6),
(16, '5_6', 6, 5);
--rollback DELETE FROM CHATGROUP WHERE id BETWEEN 1 AND 16;

--changeset focusspark:7 splitStatements:true endDelimiter:;
--comment: Insert test chat messages
INSERT INTO CHATMESSAGES (id, chat_id, sender_id, recipient_id, content, is_read, time_stamp) VALUES
-- Conversation between User 1 and User 2
(1, '1_2', 1, 2, 'Hi Jane, how are you?', true, CURRENT_TIMESTAMP),
(2, '1_2', 2, 1, 'Hi John! I am doing great, thanks!', true, CURRENT_TIMESTAMP),
(3, '1_2', 1, 2, 'That is wonderful to hear!', false, CURRENT_TIMESTAMP),
-- Conversation between User 1 and User 3
(4, '1_3', 1, 3, 'Hey Bob, did you see the latest update?', true, CURRENT_TIMESTAMP),
(5, '1_3', 3, 1, 'Yes! It looks amazing!', true, CURRENT_TIMESTAMP),
(6, '1_3', 1, 3, 'I agree, great work by the team.', false, CURRENT_TIMESTAMP),
-- Conversation between User 1 and User 4
(7, '1_4', 1, 4, 'Alice, can we schedule a meeting?', true, CURRENT_TIMESTAMP),
(8, '1_4', 4, 1, 'Sure, how about tomorrow at 2 PM?', false, CURRENT_TIMESTAMP),
-- Conversation between User 2 and User 3
(9, '2_3', 2, 3, 'Bob, thanks for your help earlier!', true, CURRENT_TIMESTAMP),
(10, '2_3', 3, 2, 'No problem Jane, happy to help!', false, CURRENT_TIMESTAMP),
-- Conversation between User 2 and User 5
(11, '2_5', 2, 5, 'Charlie, are you joining the webinar?', false, CURRENT_TIMESTAMP),
(12, '2_5', 5, 2, 'Yes, I will be there!', false, CURRENT_TIMESTAMP),
-- Conversation between User 3 and User 4
(13, '3_4', 3, 4, 'Alice, let me know when you are free.', true, CURRENT_TIMESTAMP),
(14, '3_4', 4, 3, 'I am free now, let us connect.', false, CURRENT_TIMESTAMP),
-- Conversation between User 4 and User 5
(15, '4_5', 4, 5, 'Charlie, did you complete the task?', true, CURRENT_TIMESTAMP),
(16, '4_5', 5, 4, 'Almost done, will finish by EOD.', false, CURRENT_TIMESTAMP),
-- Conversation between User 5 and User 6
(17, '5_6', 5, 6, 'Diana, welcome to the team!', true, CURRENT_TIMESTAMP),
(18, '5_6', 6, 5, 'Thank you Charlie! Excited to be here!', true, CURRENT_TIMESTAMP),
(19, '5_6', 5, 6, 'Let me know if you need any help.', false, CURRENT_TIMESTAMP);
--rollback DELETE FROM CHATMESSAGES WHERE id BETWEEN 1 AND 19;
