FROM node:18-slim

WORKDIR /app

# Install OS-level dependencies including OpenSSL
RUN apt-get update -y && apt-get install -y openssl

# Backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Frontend dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

COPY . .

RUN cd frontend && npm run build
RUN cd backend && npx prisma generate

EXPOSE 8080
CMD ["node", "backend/server.js"]
