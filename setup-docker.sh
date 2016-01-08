#!/bin/bash

# build the flask container
docker build -t prakhar1989/flask-app .

# create the network
docker network create es

# start the ES container
docker run -d --net es -p 9200:9200 -h es-primary --name es-primary elasticsearch

# index the documents
python load_data.py -i "0.0.0.0" -p "9200"

# start the flask app container
docker run -d --net es --name flask_app -p 5000:5000 prakhar1989/flask-es

