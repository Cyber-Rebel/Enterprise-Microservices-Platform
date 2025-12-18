# Seller Dashboard Service Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY seller-dashbord/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY seller-dashbord/ ./

# Expose port
EXPOSE 3005


# Start the application
CMD ["node", "server.js"]
