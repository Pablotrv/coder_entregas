FROM node:20-alpine AS dependencies

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production \
    PORT=8080

COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

RUN mkdir -p uploads logs

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://localhost:8080/health').then((res)=>process.exit(res.ok ? 0 : 1)).catch(()=>process.exit(1))"

CMD ["node", "src/app.js"]
