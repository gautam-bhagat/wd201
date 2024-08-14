# Base stage
FROM --platform=$BUILDPLATFORM node:lts-alpine as base
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
EXPOSE 3000

# Production stage
FROM base as production
ENV NODE_ENV=production
RUN npm install
COPY . .
CMD ["node", "index.js"]

# Development stage
FROM base as development
ENV NODE_ENV=development
RUN npm install -g nodemon && npm install
COPY . .
CMD ["npm", "run", "start"]

# Test stage
FROM base as test
ENV NODE_ENV=test
RUN npm install
COPY . .
CMD ["npm", "test"]
