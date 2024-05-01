FROM node:20.11.1-alpine

WORKDIR /app

COPY package*.json ./

COPY node_modules ./

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]