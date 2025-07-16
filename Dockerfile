
FROM node:22
WORKDIR /usr/repos/clear-arch
COPY ./package.json  .
RUN npm install --omit=prod
COPY ./dist ./dist
EXPOSE 5000
CMD npm start