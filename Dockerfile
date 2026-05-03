FROM node:24-alpine AS development_env

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . . 

EXPOSE 3000

CMD ["npm", "run", "dev"]