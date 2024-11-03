# Start with the PostgreSQL base image
FROM postgres:latest

# Create backup directory and copy initial seeder data into it
RUN mkdir -p /data/seed
COPY ./seeder-data /data/seed

# Copy the initialization script to the container
COPY packages/lib/scripts/init_postgres_image.sh /scripts/init_postgres_image.sh
RUN chmod +x /scripts/init_postgres_image.sh

CMD [ "/scripts/init_postgres_image.sh" ]
