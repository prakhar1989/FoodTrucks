SF Food Trucks
===

> San Francisco's finger-licking street food now at your fingertips.

![img](shot.png)

This is a fun application built to accompany the [docker curriculum](http://prakhar.me/docker-curriculum) which is a comprehensive tutorial on getting started with Docker targeted especially at beginners. The app is built with [Flask](http://flask.pocoo.org/) on the backend and [Elasticsearch](http://elastic.co/) is the search engine powering the searches. The front-end is built with [React](http://facebook.github.io/react/) and the beautiful maps are courtesy of [Mapbox](https://www.mapbox.com/).

If you find the design of the website a bit ostentatious, blame [Genius](http://genius.com) for giving me the idea of using this color scheme.  Lastly, the data for the food trucks is made available in public domain by [SF Data](https://data.sfgov.org/Economy-and-Community/Mobile-Food-Facility-Permit/rqzj-sfat).

### Running

Running it manually - 
```
# build the flask container
$ docker build -t prakhar1989/flask-app .

# create the network
$ docker network create foodtrucks

# start the ES container
$ docker run -d --net foodtrucks -p 9200:9200 -p 9300:9300 --name es elasticsearch

# start the flask app container
$ docker run -d --net foodtrucks -p 5000:5000 --name flask-app prakhar1989/flask-app
```

Using Docker Compose -
```
$ docker-compose up
```
