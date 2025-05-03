FROM node:18-alpine

WORKDIR /app

# Install ALL dependencies for build
COPY package*.json ./
RUN npm ci

# Copy application files
COPY . .

# Build the app
RUN npm run build

# Clean up development dependencies
RUN npm prune --production

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]