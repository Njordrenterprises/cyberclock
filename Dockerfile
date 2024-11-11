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

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=8000
ENV NODE_ENV=production
ENV SUPABASE_URL=
ENV SUPABASE_ANON_KEY=
ENV SITE_URL=

# Create data directory for SQLite
RUN mkdir -p /app/data && \
    chown -R bun:bun /app/data

# Expose port
EXPOSE 8000

# Start using bun
CMD ["bun", "run", "start"]