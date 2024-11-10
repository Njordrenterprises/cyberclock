# Use Bun 1.1.34
FROM oven/bun:1.1.34 as builder

WORKDIR /app

# Install SQLite dependencies
RUN apt-get update && apt-get install -y \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:1.1.34-slim

WORKDIR /app

# Install SQLite runtime
RUN apt-get update && apt-get install -y \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Copy built assets from builder
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=8000
ENV NODE_ENV=production

# Create data directory for SQLite
RUN mkdir -p /app/data && \
    chown -R bun:bun /app/data

# Expose port
EXPOSE 8000

# Start using Vinxi
CMD ["bun", "run", "start"]