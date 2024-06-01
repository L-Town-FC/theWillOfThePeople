#!/bin/bash
docker buildx ls
docker buildx create --name mybuilder --use --bootstrap
docker buildx build --push --platform linux/amd64,linux/arm64 --tag atmollohan/bot:latest .