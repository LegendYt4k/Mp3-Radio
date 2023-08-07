# Use the official Node.js image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install the required dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Start the AutoDJ script when the container starts
CMD ["node", "auto-dj.js"]
