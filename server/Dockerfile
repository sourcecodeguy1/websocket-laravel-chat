# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the Docker image
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application's dependencies in the Docker image
RUN npm install

# Install nodemon globally
RUN npm install -g nodemon

# Copy the rest of the application's source code to the working directory
COPY . .

# Expose port 3001 in the Docker image
EXPOSE 3001

# Define the command to run the application with nodemon
CMD ["nodemon", "server-socket.js"]
