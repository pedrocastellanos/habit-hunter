# syntax=docker/dockerfile:1

FROM node:20-alpine AS build
WORKDIR /app

# Enable pnpm through Corepack
RUN corepack enable

# Copy dependency manifests first to leverage layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files and build the app
COPY . .
RUN pnpm build

FROM nginx:1.27-alpine AS runtime

# Copy custom nginx config with SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static build artifacts from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
