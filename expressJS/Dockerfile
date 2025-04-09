# Use official Node.js 18 base image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Install Playwright dependencies & browsers
RUN npx playwright install --with-deps

# Copy all project files
COPY . .

# Expose your app port (based on your Express server.js)
EXPOSE 8080

# Run any Prisma setup (optional: can be handled externally if you want)
RUN npx prisma generate

# Build step placeholder (if needed)
RUN echo "No frontend build needed for pure backend"

# Start the server
CMD ["npm", "start"]
