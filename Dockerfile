# Build stage
FROM node:22-alpine AS build
WORKDIR /app

ARG PUBLIC_NAME
ARG PUBLIC_SHORT_NAME
ARG PUBLIC_DOMAIN
ARG PUBLIC_SYSTEM_NAME
ARG PUBLIC_SHORT_SYSTEM_NAME

ENV PUBLIC_NAME=$PUBLIC_NAME
ENV PUBLIC_SHORT_NAME=$PUBLIC_SHORT_NAME
ENV PUBLIC_DOMAIN=$PUBLIC_DOMAIN
ENV PUBLIC_SYSTEM_NAME=$PUBLIC_SYSTEM_NAME
ENV PUBLIC_SHORT_SYSTEM_NAME=$PUBLIC_SHORT_SYSTEM_NAME

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Run stage
FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
COPY --from=build /app/package.json ./
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3001
CMD ["node", "build"]