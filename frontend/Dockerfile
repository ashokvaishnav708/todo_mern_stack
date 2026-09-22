FROM node:24-alpine

WORKDIR /backend

COPY package*.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

EXPOSE 5173


CMD ["pnpm", "dev"]