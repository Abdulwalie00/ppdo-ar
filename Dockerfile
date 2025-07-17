# Stage 1: Build the Angular application
FROM node:18 as build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application's source code
COPY . .

# Build the application for production
RUN npm run build -- --configuration production

# Stage 2: Serve the application from a lightweight Nginx server
FROM nginx:alpine

# Copy the build output from the build stage
COPY --from=build /usr/src/app/dist/your-angular-app-name /usr/share/nginx/html

# Expose port 80
EXPOSE 80
