FROM node:15-stretch-slim AS build
WORKDIR /app
COPY package.json .
COPY package-lock.json .
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
RUN npm ci

COPY src src
COPY nest-cli.json .
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY .eslintrc.js .
COPY .prettierrc .
RUN npm run build

FROM node:15-alpine
WORKDIR /app
RUN apk add --no-cache g++ chromium --repository=http://dl-cdn.alpinelinux.org/alpine/edge/main
RUN apk add --no-cache \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY --from=build /app/node_modules node_modules
COPY --from=build /app/dist dist
COPY --from=build /app/nest-cli.json .
COPY --from=build /app/tsconfig.json .
COPY --from=build /app/tsconfig.build.json .
COPY --from=build /app/.eslintrc.js .
COPY --from=build /app/.prettierrc .

CMD ["node", "dist/main"]
