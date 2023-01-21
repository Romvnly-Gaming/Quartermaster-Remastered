## build runner
FROM node:lts-alpine as build-runner

# Set temp directory
WORKDIR /tmp/app

# Move package.json
COPY package.json .

RUN apk add --no-cache curl \
    && curl -sL https://unpkg.com/@pnpm/self-installer | node

# Install dependencies
RUN pnpm install

# Move source files
COPY src ./src
COPY tsconfig.json   .

# Build project
RUN pnpm build

## production runner
FROM node:lts-alpine as prod-runner

# Set work directory
WORKDIR /app

# Copy package.json from build-runner
COPY --from=build-runner /tmp/app/package.json /app/package.json

RUN apk add --no-cache curl \
    && curl -sL https://unpkg.com/@pnpm/self-installer | node

# Install dependencies
RUN pnpm install

# Move build files
COPY --from=build-runner /tmp/app/build /app/build

# Start bot
CMD [ "pnpm", "start" ]
