FROM node:18-alpine

WORKDIR /app

# Install dependencies first (for better layer caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy application files
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]