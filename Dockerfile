# Use official Node.js LTS image
FROM node:18-bullseye-slim

# Install Chrome and Firefox for headless testing
RUN apt-get update && \
    apt-get install -y wget gnupg2 ca-certificates && \
    # Install Chrome
    wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
    apt-get update && \
    apt-get install -y google-chrome-stable firefox-esr && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /workspace

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --include=dev

# Copy the rest of the application
COPY . .

# Expose ports for Angular/Karma
EXPOSE 9876 4200

# Default command: run tests in headless Chrome
CMD ["npx", "ng", "test", "--no-watch", "--browsers=ChromeHeadless"]