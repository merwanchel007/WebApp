FROM node:10-alpine
WORKDIR /app
COPY package.json .
COPY index.js .
COPY cont ./cont
RUN npm install

# Run the server as a non-root user
RUN adduser -D myuser
USER myuser

CMD ["node", "index.js"]