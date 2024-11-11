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

# Copy package files and install production dependencies
COPY package.json bun.lockb ./
RUN bun install --production --frozen-lockfile

# Copy built assets from builder
COPY --from=builder /app/.output ./.output

# Set runtime environment variables
ENV HOST=0.0.0.0
ENV PORT=8000
ENV NODE_ENV=production

# Create data directory for SQLite with proper permissions
RUN mkdir -p /app/data && \
    chown -R bun:bun /app/data

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Create entrypoint script
RUN echo '#!/bin/sh\n\
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then\n\
    echo "Warning: Supabase environment variables not set. Some features may be limited."\n\
fi\n\
exec bun run start\n\
' > /app/docker-entrypoint.sh && \
    chmod +x /app/docker-entrypoint.sh

# Expose port
EXPOSE 8000

# Start using entrypoint script
ENTRYPOINT ["/app/docker-entrypoint.sh"]