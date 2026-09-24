# Production Dockerfile for Portable Kubernetes Deployment
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY package.json ./
COPY config/ ./config/
COPY src/ ./src/
COPY index.js ./

EXPOSE 8080

USER node

CMD ["node", "src/server.js"]
