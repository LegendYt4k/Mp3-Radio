# Use the ubuntu:18.04 image as the base image
FROM ubuntu:18.04

# Set the working directory in the container
WORKDIR /app

# Update package repositories and install necessary system dependencies
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Create a symbolic link for node
RUN ln -s /usr/bin/nodejs /usr/bin/node

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install the required dependencies
RUN npm install

# Copy the auto-dj.js script to the container
COPY auto-dj.js .

# Copy the Songs folder to the container
COPY Songs ./Songs

# Start the AutoDJ script when the container starts
CMD ["node", "auto-dj.js"]
