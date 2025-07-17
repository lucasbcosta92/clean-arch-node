
FROM node:22
WORKDIR /usr/repos/clear-arch
COPY ./package.json  .
RUN npm install --omit=dev