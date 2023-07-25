# FROM node:slim
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm install
# COPY . .
# EXPOSE 8080
# CMD [ "npm", "run", "start:prod" ]
# docker run --rm -p 8080:8080 --env HOST_ADDRESS="0.0.0.0" --env HTTP_PORT=8080 battleship

FROM node:slim  AS builder
WORKDIR /usr
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

## this is stage two , where the app actually runs
FROM node:slim AS final
WORKDIR /usr
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /usr/dist ./dist
EXPOSE 8080
CMD ["node","dist/index.js"]