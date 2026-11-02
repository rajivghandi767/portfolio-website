# Stage 1: Build the React SPA
FROM node:24-alpine AS frontend-build

ENV NODE_OPTIONS="--max-old-space-size=1024"

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./

ARG NODE_ENV=production
ARG VITE_API_URL
ENV NODE_ENV=$NODE_ENV
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2: Unified Nginx (serves SPA static assets + reverse-proxies API)
FROM nginx:alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Remove default nginx configs - BOTH files needed
RUN rm /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copy built SPA assets from Stage 1
COPY --from=frontend-build --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Create directory for Django static files
RUN mkdir -p /usr/share/nginx/html/static && \
    chown -R nginx:nginx /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/nginx-status/ || exit 1

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
