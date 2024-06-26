FROM node:20.11.1-alpine As development
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
# Add --legacy-peer-deps to npm ci command
RUN npm ci --legacy-peer-deps
COPY --chown=node:node . .
USER node

FROM node:20.11.1-alpine As build
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .
RUN npm run build
ENV NODE_ENV production
# Add --legacy-peer-deps to npm ci command
RUN npm ci --only=production --legacy-peer-deps && npm cache clean --force
USER node

FROM node:20.11.1-alpine As production
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
CMD [ "node", "dist/main.js" ]
