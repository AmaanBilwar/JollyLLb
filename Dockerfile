# FROM node:20.14.0
# FROM express:4.19.2
# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm install

# COPY . . 

# EXPOSE 3000

# CMD ["npm", "start"]

FROM node:latest
WORKDIR /app 
COPY . .
RUN npm install 
CMD ["node", "server.js"]
EXPOSE 3000


