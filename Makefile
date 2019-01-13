include node_modules/systematic/mk/main.mk

deploy: clean dist
	rsync -avz --delete -e ssh dist/ myserver:projects/www.cocolarp.com/dist/

preprod-deploy: clean dist
	rsync -avz --delete -e ssh dist/ myserver:projects/preprod.cocolarp.com/dist/
