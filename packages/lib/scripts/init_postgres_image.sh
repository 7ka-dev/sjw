#!/bin/bash

# Check if PostgreSQL data directory is empty
if [ -z "$(ls -A /var/lib/postgresql/data)" ]; then
    echo "Seeder directory is empty. Restoring from backup..."
    
    # Restore data from the backup
    cp -R /data/seed/* /var/lib/postgresql/data

    # Start PostgreSQL in the background to allow for modifications
    docker-entrypoint.sh postgres &

    # Wait for PostgreSQL to start
    until pg_isready -U sleepyjoe -d postgres; do
        sleep 1
    done

    # Default database name
    OLD_DB_NAME="sjw_db"
    NEW_DB_NAME="${POSTGRES_DB:-$OLD_DB_NAME}"

    # Check if database renaming is needed
    if [ "$NEW_DB_NAME" != "$OLD_DB_NAME" ]; then
        echo "Renaming database from $OLD_DB_NAME to $NEW_DB_NAME..."
        
        # Connect to the default postgres database to perform the renaming
        psql -U sleepyjoe -d postgres <<-EOSQL
            ALTER DATABASE $OLD_DB_NAME RENAME TO $NEW_DB_NAME;
EOSQL
    else
        echo "Database renaming not needed."
    fi

     # Check if POSTGRES_USER and POSTGRES_PASSWORD are set
    if [[ -z "$POSTGRES_USER" || -z "$POSTGRES_PASSWORD" ]]; then
        echo "POSTGRES_USER and POSTGRES_PASSWORD environment variables are required."
        exit 1
    fi

    # Temporary superuser credentials
    TEMP_USER="${POSTGRES_USER}_temp"
    TEMP_PASSWORD="temp_password"

    # Create a temporary superuser
    echo "Creating temporary superuser $TEMP_USER..."
    psql -U sleepyjoe -d postgres <<-EOSQL
        CREATE ROLE $TEMP_USER WITH LOGIN SUPERUSER PASSWORD '$TEMP_PASSWORD';
EOSQL

    # Rename the sleepyjoe user and set new password
    echo "Renaming sleepyjoe to $POSTGRES_USER and updating password..."
    PGPASSWORD="$TEMP_PASSWORD" psql -U $TEMP_USER -d postgres <<-EOSQL
        ALTER ROLE sleepyjoe RENAME TO $POSTGRES_USER;
        ALTER ROLE $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD';
EOSQL

    # Log in as the updated user and drop the temporary user
    echo "Removing temporary superuser $TEMP_USER..."
    PGPASSWORD="$POSTGRES_PASSWORD" psql -U $POSTGRES_USER -d postgres <<-EOSQL
        DROP ROLE $TEMP_USER;
EOSQL

    echo "Modifications completed. Restarting PostgreSQL in the foreground..."

    gosu postgres pg_ctl -D /var/lib/postgresql/data -m fast stop
else
    echo "Seeder directory is not empty. Skipping restore and modifications."
fi

# Start PostgreSQL in the foreground
exec docker-entrypoint.sh postgres