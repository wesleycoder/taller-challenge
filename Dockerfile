# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=22.9.0
FROM node:${NODE_VERSION}-slim as base
LABEL fly_launch_runtime="Node.js"

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Node.js app lives here
COPY . /app
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Throw-away build stage to reduce size of final image
FROM base as build

# Install node modules
# COPY pnpm-lock.yaml package.json /app/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --prod=false

# Build application
RUN pnpm run build

# Remove development dependencies
RUN pnpm prune --prod


# Final stage for app image
FROM base

# Copy node_modules from pnpm cache
COPY --from=prod-deps /app/node_modules /app/node_modules

# Copy built application
COPY --from=build /app/dist dist
RUN ls dist

# Setup sqlite3 on a separate volume
RUN mkdir -p /data
VOLUME /data

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "npm", "run", "start" ]
