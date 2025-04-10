FROM node:18-slim

WORKDIR /app

# Install OS-level dependencies including OpenSSL & Playwright deps
RUN apt-get update -y && apt-get install -y openssl wget ca-certificates gnupg libgtk-3-0 libnss3 libxss1 libasound2 libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libxshmfence1 libxext6 libxfixes3 libxrender1 libxcb1 libx11-6 libpangocairo-1.0-0 libatk-bridge2.0-0 libatk1.0-0 libcups2 libdrm2 libdbus-1-3 libxinerama1

# Backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Frontend dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Install Playwright browsers
RUN npx playwright install --with-deps

# Copy full project files
COPY . .

# Build frontend
RUN cd frontend && npm run build

# Generate Prisma client
RUN cd backend && npx prisma generate

WORKDIR /app/backend

EXPOSE 8080
CMD ["node", "server.js"]
