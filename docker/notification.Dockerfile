# Notification Service Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY notification/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY notification/ ./

# Expose port
EXPOSE 3004


# Start the application
CMD ["node", "server.js"]
