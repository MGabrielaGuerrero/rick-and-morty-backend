# Dockerfile
FROM node:18

# create app directory
WORKDIR /app

# Copy package.json and install depencencies
COPY package*.json ./
RUN npm install

# Install netcat y wait-for
RUN apt-get update && \
    apt-get install -y curl netcat-openbsd && \
    rm -rf /var/lib/apt/lists/* && \
    curl -o /usr/local/bin/wait-for https://raw.githubusercontent.com/Eficode/wait-for/master/wait-for && \
    chmod +x /usr/local/bin/wait-for

# Copy source code
COPY . .

# compile typescript
RUN npm run build

# expose the app port
EXPOSE 4000

# start the app and wait for db and redis
CMD ["sh", "-c", "wait-for db:3306 -- wait-for redis:6379 -- node dist/app.js"]


