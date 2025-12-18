# Cart Service Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY cart/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY cart/ ./

# Expose port
EXPOSE 3002


# Start the application
CMD ["node", "server.js"]
