FROM node:18-alpine
RUN apk update && apk upgrade && apk add --no-cache libcrypto3 libssl3
# Security: Run as non-root user (Good for DevSecOps!)
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3001 

CMD ["node", "index.js"]