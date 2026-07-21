FROM node:22.23.1-alpine3.23

WORKDIR /app

ENV NODE_ENV=production

COPY --chown=node:node package.json server.js ./
COPY --chown=node:node public ./public

EXPOSE 8080

USER node

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:8080/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
