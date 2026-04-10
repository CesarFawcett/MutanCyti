# Use Node.js Alpine
FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose the port
EXPOSE 80

# Start the server
CMD [ "npm", "start" ]
