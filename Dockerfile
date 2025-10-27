FROM node:20-alpine

WORKDIR /app

RUN corepack disable && npm i -g yarn@1.22.22
COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile || yarn install

COPY . .

EXPOSE 5173
CMD ["yarn", "dev", "--host", "0.0.0.0", "--port", "5173"]
