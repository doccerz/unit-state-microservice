FROM node:24-slim AS deps
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev

FROM node:24-slim AS production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY src/ ./src/
COPY migrations/ ./migrations/
COPY scripts/ ./scripts/
COPY package.json ./
EXPOSE 3000
CMD ["node", "src/server.js"]
