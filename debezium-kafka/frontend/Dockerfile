# Use the official Nginx image as a base
FROM nginx:alpine

# Copy your static site content into Nginx's web root
COPY ./index.html /usr/share/nginx/html/index.html

# Optional: Copy custom nginx config (if needed)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80
