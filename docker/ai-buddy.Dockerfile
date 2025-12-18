# AI Buddy Service Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY ai-buddy/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY ai-buddy/ ./

# Expose port
EXPOSE 3006


# Start the application
CMD ["node", "server.js"]
