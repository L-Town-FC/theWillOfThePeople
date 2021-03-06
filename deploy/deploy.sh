#!/bin/bash
tag=latest
repo=atmollohan
name=bot
image_full_tag=$repo/$name:$tag
env_file_name=.env
env_file_location=$PWD/$env_file_name
if [ ! -e "$env_file_location" ]; then
    echo ".env file does not exist got find it"
else 
    echo "Sourcing .env for deployment it..."
    source env_file_location
    echo "Ready to connect to $EC2_HOST as $EC2_USER"
    echo "Trial is $TRIAL on client"
    ssh -i ~/.aws/my-ec2-key-pair.pem -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST  TRIAL=$TRIAL BOTTOKEN=$BOTTOKEN  IMAGE_NAME=$image_full_tag CONTAINER_NAME=$name '''
    echo "Connected to $HOSTNAME as $USER at $PWD"
    echo "Trial is $TRIAL on server"
    docker stop $CONTAINER_NAME; docker rm $CONTAINER_NAME
    docker pull $IMAGE_NAME
    docker run -d -e BOTTOKEN=$BOTTOKEN --name $CONTAINER_NAME $IMAGE_NAME
    '''
fi 