# Production Environment
FROM nginx:alpine

# Copy build files from host
COPY dist /usr/share/nginx/html

# Copy custom nginx configuration for SPA routing support
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
