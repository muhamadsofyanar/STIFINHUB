FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000 DATA_FILE=/app/data/database.json BACKUP_DIR=/app/data/backups MEDIA_DIR=/app/data/media BACKUP_INTERVAL_MINUTES=360 BACKUP_RETENTION=30 BROADCAST_DELAY_MS=500
COPY package.json server.js seed.js integrations.js ./
COPY public ./public
RUN mkdir -p /app/data && chown -R node:node /app
USER node
EXPOSE 3000
VOLUME ["/app/data"]
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD wget -qO- http://127.0.0.1:3000/health || exit 1
CMD ["node", "server.js"]
