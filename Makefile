deploy:
	rsync -avz --delete -e ssh dist/ myserver:projects/www.cocolarp.com/frozen/
