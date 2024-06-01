build:
	. ./build/build.sh

deploy_aws:
	. ./deploy/deployAws.sh

deploy_pi:
	. ./deploy/deployPi.sh

develop:
	npm run start:dev

clean: 
	rm -rf node_modules/ package-lock.json

clean_install:
	clean install

install:
	npm install

set_env:
	. ./.env

start:
	npm start