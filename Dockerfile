FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# for development only
CMD ["npm", "run", "start:dev"]

# for production only
# CMD ["npm", "run", "start:prod"]