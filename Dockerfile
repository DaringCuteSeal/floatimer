FROM node:26 AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --ignore-scripts

COPY . .

ENV BETTER_AUTH_SECRET="dummy"
ENV BETTER_AUTH_BASE_URL="http://localhost:3000"
ENV DATABASE_URL="postgresql://mock:mock@localhost:5432/mock" 
ENV PORT=3000

RUN pnpm run build

RUN pnpm prune --production


FROM node:26 AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json ./
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/drizzle ./drizzle

COPY scripts/migrate-db.js ./
COPY scripts/run.sh ./
RUN chmod +x run.sh

EXPOSE 3000

CMD ["./run.sh"]
