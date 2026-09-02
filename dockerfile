FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_DEMO_SYNC_URL
ARG VITE_DEMO_API_URL

ENV VITE_DEMO_SYNC_URL=$VITE_DEMO_SYNC_URL
ENV VITE_DEMO_API_URL=$VITE_DEMO_API_URL

RUN npm run build

FROM nginx:alpine AS production

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80