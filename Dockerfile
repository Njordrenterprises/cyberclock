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
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.output ./.output

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=8000
ENV NODE_ENV=production

# Create volume for SQLite database
VOLUME /app/data
RUN mkdir -p /app/data

# Expose port
EXPOSE 8000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start using production mode
CMD ["bun", "run", "start"]