# ---- Build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# For some Node modules that need glibc compat
RUN apk add --no-cache libc6-compat

# Copy dependency files and install deps
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the app
COPY . .

# Disable Next telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Build the Next.js app
RUN npm run build

# ---- Runtime stage ----
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN adduser -D nextjs
USER nextjs

# Copy everything from builder (includes .next, public, node_modules, etc.)
COPY --from=builder /app ./

EXPOSE 3000

# Uses your "start": "next start" script
CMD ["npm", "start"]
