# Order Service Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY order/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY order/ ./

# Expose port
EXPOSE 3003


# Start the application
CMD ["node", "server.js"]
