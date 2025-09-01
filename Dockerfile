FROM node:22-alpine

WORKDIR /app

# Copy everything including node_modules and built files
COPY . .

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Start the application
CMD ["npm", "start"]