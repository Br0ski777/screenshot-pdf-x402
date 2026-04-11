FROM oven/bun:1 AS base
WORKDIR /app

RUN apt-get update && apt-get install -y chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY package.json bun.lock* ./
RUN bun install --production

COPY . .

EXPOSE 3000
CMD ["bun", "run", "src/index.ts"]
