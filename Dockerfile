# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:22.23.2-alpine3.24 AS build

# Passed from Jenkins --build-arg BUILD_ENV=<uat|production>
ARG BUILD_ENV=uat

WORKDIR /usr/src/app

# Install dependencies (separate layer for cache efficiency)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source and build with the chosen Vite mode
# Loads the matching .env.<BUILD_ENV> file automatically
COPY . .
RUN npm run build -- --mode ${BUILD_ENV}

# ── Stage 2: Serve ───────────────────────────────────────────────────────────
FROM nginx:alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /usr/share/nginx/html/lms
COPY --from=build /usr/src/app/dist /usr/share/nginx/html/lms

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
