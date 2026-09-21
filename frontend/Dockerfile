FROM node:26-alpine

WORKDIR /backend

COPY package*.json ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

EXPOSE 5173


CMD ["pnpm", "dev"]