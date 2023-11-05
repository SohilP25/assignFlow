# Use the official Node.js 16 (LTS) image as a parent image
FROM node:16-alpine

# Set the working directory within the container to /app
WORKDIR /app

# Copy the 'package.json' and 'package-lock.json' (if available) to the container
COPY package*.json ./

# Install dependencies within the container
RUN npm install

# Copy the rest of the application's code to the container
COPY . .

# Inform Docker that the container listens on the specified port at runtime.
# Replace "3000" with the port that your app runs on
EXPOSE 3000

# Run the application using npm start or node command
CMD ["npm", "start"]
