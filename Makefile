image = jzaefferer/pet-reminder-api
host = 'https://pet-reminder-api.sloppy.zone/v1/pets'
doggo = '{ "name": "Muffin", "type": "doggo" }'

local:
	docker-compose up --build
build:
	docker build -f Dockerfile-prod -t $(image) .
run:
	docker run -it -p 7778:7778 -e PORT=7778 -e COUCHDB_URL=http://admin:sikrit@localhost:5984 $(image):latest
push:
	docker push $(image)
deploy:
	sloppy change sloppy.yml
test:
	curl -X POST -H 'Content-Type: application/json' -d $(doggo) $(host)
