# FROM node:current-alpine

# WORKDIR /frontend

# COPY package*.json .

# RUN npm i

# CMD ["npm","run","dev"]

FROM node:current-alpine as base
WORKDIR /frontend
COPY package*.json .
RUN npm install
COPY . .

FROM base as dev
CMD ["npm","run","dev"]

# FROM base as build
# RUN npm run build

# FROM nginx:latest-alpine as prod
# COPY --from=build /frontend/dist /usr/share/nginx/html
# CMD ["nginx", "-g", "daemon off;"]