FROM node:20-bookworm-slim AS deps

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json ./
RUN npm install --omit=dev

FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

RUN groupadd --system --gid 1001 app \
  && useradd --system --uid 1001 --gid app app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src

USER app

EXPOSE 5000

CMD ["node", "src/server.js"]
