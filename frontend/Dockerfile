# syntax=docker/dockerfile:1.7

# =========================
# BUILD STAGE
# =========================
FROM node:22-alpine AS build

WORKDIR /app

# Dependency manifests
COPY package.json package-lock.json ./

# Install dependencies with npm cache
RUN --mount=type=cache,id=moneytracker-npm,target=/root/.npm \
    npm ci

# Application sources
COPY . .

# Build production bundle
RUN npm run build


# =========================
# RUNTIME STAGE
# =========================
FROM nginx:alpine AS runtime

# Copy production build
COPY --from=build /app/dist/ /usr/share/nginx/html/

# Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]