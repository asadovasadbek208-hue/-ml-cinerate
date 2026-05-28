FROM node:20-bookworm-slim
WORKDIR /app
RUN apt-get update && apt-get install -y openssl
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 5000
CMD ["sh", "-c", "npx prisma migrate deploy && node src/index.js"]