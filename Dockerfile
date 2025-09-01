FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Try without cache clean first
RUN npm install

# Copy all files
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Start the application
CMD ["npm", "start"]