#!/bin/bash
docker container inspect -f "{{.State.Status}}" $CONTAINER_NAME
docker stop $CONTAINER_NAME; docker rm $CONTAINER_NAME
docker pull $IMAGE_NAME
docker run -d -e PRODBOTTOKEN=$PRODBOTTOKEN -e NODE_ENV=production -e FAUNA_KEY=$FAUNA_KEY --name $CONTAINER_NAME $IMAGE_NAME