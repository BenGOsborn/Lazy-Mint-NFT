# Environment setup
FROM node:17-alpine3.12
WORKDIR /app

# Copy over requirements
COPY package* .
RUN npm install --production
COPY app.js .

# Start the container
CMD ["npm", "run", "server"]