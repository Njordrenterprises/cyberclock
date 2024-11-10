FROM oven/bun:1.0.35-slim

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies with Bun
RUN bun install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application with Vinxi
RUN bun run build

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

# Start using Vinxi
CMD ["bun", "run", "start"]