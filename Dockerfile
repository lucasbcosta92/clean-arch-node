FROM node:22
WORKDIR /usr/repos/clean-arch
COPY ./package.json .
RUN npm install --omit=dev
