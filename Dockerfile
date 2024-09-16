# Use an official Node.js runtime as a parent image
FROM node:18-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Set environment variable for API base URL
ENV REACT_APP_API_BASE_URL=http://localhost:4000

# Build the React application
RUN npm run build

# Use an official Nginx image to serve the built application
FROM nginx:alpine

# Copy the built application from the build stage to the Nginx container
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]