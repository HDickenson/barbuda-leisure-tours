FROM node:20-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml .pnpm-workspace.yaml ./
COPY packages ./packages
COPY app ./app
COPY apps ./apps
COPY workers ./workers
COPY tsconfig.json .

RUN pnpm install --frozen-lockfile --offline || pnpm install --frozen-lockfile

# Default: run the full pipeline using the local scout implementation
CMD ["pnpm", "tsx", "scripts/run_docker_pipeline.ts"]
