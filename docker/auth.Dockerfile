# Auth Service Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY auth/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY auth/ ./

# Expose port
EXPOSE 3000

 

# Start the application
CMD ["node", "server.js"]
