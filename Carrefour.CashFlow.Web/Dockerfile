FROM node:latest
WORKDIR /usr/local/app
COPY Carrefour.CashFlow.Web/package.json .
RUN npm install --force
COPY Carrefour.CashFlow.Web/ .
EXPOSE 4200
CMD [ "npm", "run", "start" ]
