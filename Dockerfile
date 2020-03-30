# Pull base node image
FROM node

# Make project dir
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

# install dependencies
COPY package.json /usr/src/bot
RUN npm i

# Add project to container
COPY . /usr/src/bot

# Run bot
CMD ["node", "index.js"]