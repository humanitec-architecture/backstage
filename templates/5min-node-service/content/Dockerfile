FROM alpine:3 as builder
RUN apk add --no-cache nodejs npm
COPY package*.json ./
RUN npm install --only=prod

FROM alpine:3
RUN apk add --no-cache nodejs
COPY --from=builder /node_modules ./node_modules
COPY index.js index.js
EXPOSE 3000
CMD ["node", "index.js"]
