# Liquibase Database Migration

This project uses Liquibase for database schema management and version control.

## Structure

```
src/main/resources/db/changelog/
├── db.changelog-master.xml          # Master changelog file
└── changes/
    ├── 001-create-tables.sql        # Table creation scripts
    └── 002-insert-test-data.sql     # Test data insertion scripts
```

## Changelog Files

### 1. **001-create-tables.sql** - Database Schema Creation
- Creates USERS table with constraints
- Creates CHATGROUP table with foreign keys
- Creates CHATMESSAGES table with foreign keys
- Creates indexes for performance optimization

### 2. **002-insert-test-data.sql** - Test Data
- Inserts 6 test users
- Creates 16 chat group relationships (8 bidirectional conversations)
- Inserts 19 sample chat messages

## Configuration

Liquibase is configured in `application.properties`:

```properties
spring.jpa.hibernate.ddl-auto=none
spring.liquibase.enabled=true
spring.liquibase.change-log=classpath:db/changelog/db.changelog-master.xml
spring.liquibase.drop-first=false
```

## Liquibase Commands

### View current status
```bash
mvn liquibase:status
```

### Update database to latest version
```bash
mvn liquibase:update
```

### Rollback last changeset
```bash
mvn liquibase:rollback -Dliquibase.rollbackCount=1
```

### Generate SQL for changes (without executing)
```bash
mvn liquibase:updateSQL
```

### Clear checksums (if needed)
```bash
mvn liquibase:clearCheckSums
```

## How It Works

1. **On Application Startup**: Liquibase automatically runs and applies any pending changesets
2. **Tracking**: Liquibase maintains a `DATABASECHANGELOG` table to track applied changes
3. **Idempotent**: Each changeset runs only once (tracked by changeset ID)
4. **Rollback Support**: Each changeset includes rollback SQL for safe reversal

## Adding New Changes

### To add a new migration:

1. Create a new SQL file in `db/changelog/changes/` (e.g., `003-add-new-feature.sql`)
2. Use Liquibase formatted SQL syntax:

```sql
--liquibase formatted sql

--changeset author:uniqueId splitStatements:true endDelimiter:;
--comment: Description of change
-- Your SQL statements here
--rollback Your rollback SQL here
```

3. Include the new file in `db.changelog-master.xml`:

```xml
<include file="db/changelog/changes/003-add-new-feature.sql" relativeToChangelogFile="false"/>
```

## Best Practices

1. **Never modify existing changesets** - Always create new ones
2. **Include rollback statements** - Enables safe rollback if needed
3. **Use descriptive comments** - Makes change history clear
4. **Test rollbacks** - Ensure rollback SQL works correctly
5. **Keep changesets small** - Easier to track and rollback if needed
6. **Use sequential numbering** - Helps maintain order (001-, 002-, etc.)

## Database Tables

### USERS
- Stores user information (id, firstname, lastname, nick_name, status)
- Unique constraint on nick_name
- Status constraint (ONLINE/OFFLINE)

### CHATGROUP
- Represents chat relationships between users
- Foreign keys to USERS table
- Bidirectional entries for each conversation

### CHATMESSAGES
- Stores individual chat messages
- Foreign keys to USERS table for sender and recipient
- Includes read status and timestamp

## Notes

- The old `data.sql` file is now deprecated
- Schema is managed entirely by Liquibase
- Changes are version controlled and traceable
- Database state can be reproduced consistently across environments
