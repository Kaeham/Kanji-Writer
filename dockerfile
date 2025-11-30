FROM node:22-alpine AS builder
WORKDIR /my-app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:22-alpine
WORKDIR /my-app
COPY --from=builder /my-app/build build/
COPY --from=builder /my-app/node_modules node_modules/
COPY package.json .
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "build"]