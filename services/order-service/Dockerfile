FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --chown=node:node package*.json ./

RUN npm install --omit=dev

COPY --chown=node:node src ./src

EXPOSE 3002

USER node

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3002/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "src/server.js"]
