#!/bin/bash
echo 'BUILDING'
. $PWD/deploy/timeInfo.sh

tag=latest
repo=atmollohan
name=bot
image_full_tag=$repo/$name:$tag
env_file_name=.env
env_file_location=$PWD/$env_file_name

if [ ! -e "$env_file_location" ]; then
    echo ".env file does not exist got find it"
else 
    echo "Sourcing .env for build..."
    echo "$env_file_location"
    source "$env_file_location"
    echo "LOGGING into host: $DOCKER_HOST as $DOCKER_USER"
    # echo $DOCKER_TOKEN | docker login -u="$DOCKER_USER" --password-stdin $DOCKER_HOST && \
    echo 'BUILDING' && \
    docker build -t $image_full_tag . && \
    echo 'PUSHING to docker hub' && \
    docker push $image_full_tag
fi