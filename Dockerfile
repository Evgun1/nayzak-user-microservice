FROM node:24-alpine as build
WORKDIR /opt/user-service
ADD *.json ./
RUN npm ci
ADD . .
RUN npm run build





FROM node:24-alpine
WORKDIR /opt/user-service
COPY --from=build /opt/user-service/dist ./dist
ADD *.json ./
RUN npm ci --omit=dev
CMD [ "node", "./dist/main.js" ]








# WORKDIR /app/ 
# COPY package*.json ./ 
# RUN npm install 
# COPY . .
# EXPOSE 3000
# CMD ["npm","run","start:dev"]

