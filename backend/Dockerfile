FROM node:24-alpine

WORKDIR /backend

RUN npm install -g pnpm

COPY package*.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

EXPOSE 5000


CMD ["pnpm", "dev"]