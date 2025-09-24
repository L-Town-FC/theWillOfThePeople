# Pull base node image
FROM node:22.19.0

# Make project dir
ENV PROJECTDIR /usr/src/bot
RUN mkdir -p $PROJECTDIR
WORKDIR $PROJECTDIR

# install dependencies
COPY package.json .
RUN npm i --omit=dev

# Add project to container
COPY . .

# Run bot
CMD ["node", "index.js"]