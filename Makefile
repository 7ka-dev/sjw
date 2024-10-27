# Makefile

# Step 1: Stop Docker Compose
down:
	docker compose down

# Step 2: Remove sjw_postgres-data volume
remove_volume:
	docker volume rm sjw_postgres-data || echo "Volume 'sjw_postgres-data' does not exist."

# Step 3: Start Docker Compose
up:
	docker compose up -d

# Step 4: Run pnpm command for apps/builder
run_builder:
	pnpm --filter ./apps/builder start

# Step 5: Run pnpm command for apps/seeder
run_seeder:
	pnpm --filter ./apps/seeder start

commit_sjw_db:
	docker commit sjw-db dev7ka/sjw:latest
	docker push dev7ka/sjw:latest

# Combined target to run all steps
db: down remove_volume up run_builder run_seeder commit_sjw_db
	@echo "Restart and seeding complete."

studio: 
	cd packages/lib && pnpm drizzle-kit studio