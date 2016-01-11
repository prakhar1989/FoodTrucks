#!/bin/bash

# configure
ecs-cli configure --region us-east-1 --cluster foodtrucks

# setup cloud formation template
ecs-cli up --keypair ecs --capability-iam --size 2 --instance-type t2.micro

# deploy
ecs-cli compose --file aws-compose.yml up

# check
ecs-cli ps
