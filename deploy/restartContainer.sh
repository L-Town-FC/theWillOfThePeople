docker stop $CONTAINER_NAME; docker rm $CONTAINER_NAME
docker pull $IMAGE_NAME
docker run -d -e BOTTOKEN=$BOTTOKEN --name $CONTAINER_NAME $IMAGE_NAME