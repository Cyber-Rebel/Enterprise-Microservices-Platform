# Product Service Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY product/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY product/ ./

# Expose port
EXPOSE 3001



# Start the application
CMD ["node", "server.js"]
