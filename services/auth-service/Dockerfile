FROM node:18-alpine

# Security: Run as non-root user (Good for DevSecOps!)
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000 
# (Change EXPOSE port per service: 3000, 3001, or 3002)

CMD ["node", "index.js"]