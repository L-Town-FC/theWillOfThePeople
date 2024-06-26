#!/bin/bash
echo 'BUILDING'
. $PWD/deploy/timeInfo.sh

repo=atmollohan
name=bot
image_full_tag=$repo/$name:$tag
tag=latest
env_file_name=.env
env_file_location=$PWD/$env_file_name

if [ ! -e "$env_file_location" ]; then
    echo ".env file does not exist got find it"
else 
    echo "Sourcing .env for build..."
    echo "$env_file_location"
    source "$env_file_location"
    echo 'BUILDING' && \
    docker build -t $image_full_tag . && \
    echo 'PUSHING to docker hub' && \
    docker push $image_full_tag
fi