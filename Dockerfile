FROM node:18-slim

WORKDIR /app

# Copy backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy frontend dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Copy the whole project
COPY . .

# Build frontend (Remix)
RUN cd frontend && npm run build

# Generate Prisma (optional)
RUN cd backend && npx prisma generate

# Expose port
EXPOSE 8080

# Start server
CMD ["node", "backend/server.js"]
