
# studio: 
# 	cd packages/lib && pnpm drizzle-kit studio
include .env

# Seeder environment variables
SEEDER_POSTGRES_USER=sleepyjoe
SEEDER_POSTGRES_PASSWORD=endofquote
SEEDER_POSTGRES_DB=sjw_db
SEEDER_DIR=seeder-data
SEEDER_CONTAINER_NAME=seeder

# Image names
IMAGE_NAME=postgres:latest
BACKUP_IMAGE_NAME=postgres-backup:latest
DOCKER_IMAGE_NAME=dev7ka/sjw:latest

# Test environment variables
TEST_POSTGRES_USER=testuser
TEST_POSTGRES_PASSWORD=testpassword
TEST_POSTGRES_DB=testdb
TEST_CONTAINER_NAME=test-db
TEST_DIR=test-data

# Start a PostgreSQL container for seeding data
init_seeder:
	@echo "Starting PostgreSQL container for seeder..."
	mkdir -p $(DATA_DIR)
	docker run --rm \
		--name $(CONTAINER_NAME) \
		-e POSTGRES_USER=$(DB_USER) \
		-e POSTGRES_PASSWORD=$(DB_PASSWORD) \
		-e POSTGRES_DB=$(DB_NAME) \
		-v $(PWD)/$(DATA_DIR):/var/lib/postgresql/data \
		-p $(DB_PORT):5432 \
		-d $(IMAGE_NAME)
	sleep 10



migrate_seeder:
	pnpm seeder:build

populate_seeder:
	@echo "Populating seeder database..."
	pnpm seeder:seed

# Stop and remove the seeder container
cleanup_seeder:
	@echo "Stopping and removing seeder PostgreSQL container..."
	docker stop $(SEEDER_CONTAINER_NAME)

# Build a Docker image based on the current setup
build_image:
	@echo "Building Docker image..."
	docker build -t $(DOCKER_IMAGE_NAME) .

# Test the built image by running a container with test configuration
test_image:
	@echo "Starting PostgreSQL container for testing..."
	mkdir -p $(DATA_DIR_TEST)
	docker run --rm \
		--name $(CONTAINER_NAME_TEST) \
		-e POSTGRES_USER=$(DB_USER_TEST) \
		-e POSTGRES_PASSWORD=$(DB_PASSWORD_TEST) \
		-e POSTGRES_DB=$(DB_NAME_TEST) \
		-v $(PWD)/$(DATA_DIR_TEST):/var/lib/postgresql/data \
		-p $(DB_PORT_TEST):5432 \
		-d $(DOCKER_IMAGE_NAME)
	sleep 10

# Stop and clean up the test container and test data directory
cleanup_test:
	@echo "Stopping and removing test PostgreSQL container..."
	docker stop $(TEST_CONTAINER_NAME)
	docker rm $(TEST_CONTAINER_NAME)
	rm -rf $(TEST_DIR)
	rm -rf $(SEEDER_DIR)

rebuild_test:
	@echo "Rebuilding test container..."
	rm -rf $(DATA_DIR_TEST)
	docker rm -f $(TEST_CONTAINER_NAME)
	$(MAKE) build_image
	$(MAKE) test_image