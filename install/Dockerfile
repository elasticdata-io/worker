FROM node:15-stretch-slim AS build
WORKDIR /app
COPY package.json .
COPY package-lock.json .
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
RUN npm ci

COPY src src
COPY nest-cli.json .
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY .eslintrc.js .
COPY .prettierrc .
RUN npm run build

FROM node:15-slim
WORKDIR /app
RUN apt-get update && apt-get install curl gnupg -y \
  && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install google-chrome-stable -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/* \

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

COPY --from=build /app/node_modules node_modules
COPY --from=build /app/dist dist
COPY --from=build /app/nest-cli.json .
COPY --from=build /app/tsconfig.json .
COPY --from=build /app/tsconfig.build.json .
COPY --from=build /app/.eslintrc.js .
COPY --from=build /app/.prettierrc .

CMD ["node", "dist/main"]
