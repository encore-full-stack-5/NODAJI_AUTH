# Stage 1: Build the application
FROM node:20.11.1 as builder

WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies with --legacy-peer-deps
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Create the production image
FROM node:20.11.1

WORKDIR /app

# Copy the build output and package.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies with --legacy-peer-deps
RUN npm install --only=production --legacy-peer-deps

# Expose the port the app runs on
EXPOSE 8081

# Command to run the application
CMD ["node", "dist/main"]