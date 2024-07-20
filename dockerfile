FROM node:20.12.2

RUN npm install -g pnpm

# Set the working directory in the container
WORKDIR /umbra-microservice

# Copy package.json and package-lock.json (if exists) to the working directory
COPY package*.json ./
COPY umbra-*/package*.json umbra-*/package*.json ./ 

# Install dependencies
RUN pnpm install

# Copy the rest of the server application code
COPY . .

EXPOSE 8081

# Command to run the server
CMD ["pnpm", "start:dev"]