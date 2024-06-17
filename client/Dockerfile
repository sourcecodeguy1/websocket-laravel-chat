# Build stage
FROM node:18-alpine as build

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the client application's dependencies
RUN npm ci

# Copy the rest of the client application's source code
COPY . .

# Build the Angular application
RUN npm run build --prod

# Production stage
FROM nginx:stable-alpine

# Copy the built files from the previous stage
COPY --from=build /app/dist/my-angular-app /usr/share/nginx/html

# Copy the Nginx configuration
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the web server
EXPOSE 3003

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
