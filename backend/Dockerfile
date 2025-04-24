# Use the official Node.js image as a base image
FROM node:alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies defined in package.json
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Expose the WebSocket server port (e.g., 5000)
EXPOSE 5000

# Run the Node.js application
CMD ["node", "index.js"]
