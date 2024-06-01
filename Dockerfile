# Pull base node image
FROM node:18.9

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