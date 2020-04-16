#!/bin/bash

# configure
ecs-cli configure --region us-east-1 --cluster foodtrucks

# setup cloud formation template
ecs-cli up --keypair ecs --capability-iam --size 1 --instance-type t2.medium

# deploy
cd aws-ecs && ecs-cli compose --file aws-compose.yml up

# check
ecs-cli ps
