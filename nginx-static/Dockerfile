FROM nginx:alpine

# Create a non-root user to run Nginx
RUN addgroup -g 1000 nginx_static && \
    adduser -u 1000 -G nginx_static -h /home/nginx_static -D nginx_static

# Copy configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Define volumes for static and media files
VOLUME /static
VOLUME /media

# Set appropriate permissions
RUN chown -R nginx_static:nginx_static /var/cache/nginx /var/log/nginx /etc/nginx/conf.d

# Switch to non-root user
USER nginx_static

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD [ "wget", "-q", "--spider", "http://localhost:80/health/" ]

# Expose port
EXPOSE 80