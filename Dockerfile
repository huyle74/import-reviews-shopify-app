FROM node:18-slim

WORKDIR /app

# Backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Frontend dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Copy only app source AFTER deps are installed (better caching)
COPY . .

# Build Remix frontend
RUN cd frontend && npm run build

# Install only Chromium to reduce size
RUN npx playwright install chromium

# Generate Prisma client
RUN cd backend && npx prisma generate

EXPOSE 8080
CMD ["node", "backend/server.js"]
