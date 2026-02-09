# syntax = docker/dockerfile:1

ARG NODE_VERSION=22.11.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Next.js"
WORKDIR /app
ENV NODE_ENV="production"

FROM base AS build

# Keep production NODE_ENV, but allow dev deps
ENV NPM_CONFIG_PRODUCTION=false
ENV NPM_CONFIG_OPTIONAL=true
ENV NPM_CONFIG_PLATFORM=linux
ENV NPM_CONFIG_ARCH=x64
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_PREVIEW_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_PREVIEW_URL=$NEXT_PUBLIC_PREVIEW_URL

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Don't use package-lock.json to avoid macOS-only native bindings
COPY package.json ./
RUN npm install --include=dev --include=optional
# Force Linux native bindings for Tailwind + LightningCSS
RUN npm install --no-save @tailwindcss/oxide-linux-x64-gnu lightningcss-linux-x64-gnu
RUN npm rebuild @tailwindcss/oxide lightningcss

COPY . .
RUN npx next build

RUN npm prune --omit=dev

FROM base
COPY --from=build /app /app
ENTRYPOINT [ "/app/docker-entrypoint.js" ]
EXPOSE 3000
CMD [ "npm", "run", "start" ]
