sudo docker compose run nextjs npm run db:seed

npx prisma migrate dev --name "init"