FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --production

COPY cube.js ./
COPY models/ ./models/

ENV PORT=4000
ENV CUBEJS_PORT=4000
ENV CUBEJS_DB_TYPE=sqlite
ENV CUBEJS_DB_NAME=/app/sales.db
ENV CUBEJS_DEV_MODE=false
ENV CUBEJS_API_SECRET=metricmind_secret_key

EXPOSE 4000

CMD ["npm", "start"]
