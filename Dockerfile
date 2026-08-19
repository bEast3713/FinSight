# Use stable version
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files first
COPY package*.json ./

# Install ALL dependencies (including dev)
RUN npm install

# Copy rest of the app
COPY . .

# Fix permissions AFTER copying everything
RUN chown -R node:node /usr/src/app

# Switch user
USER node

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "run", "dev"]