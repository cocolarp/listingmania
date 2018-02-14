include node_modules/systematic/mk/main.mk

deploy: clean dist
	rsync -avz --delete -e ssh dist/ myserver:projects/cocolarp.com/dist/
