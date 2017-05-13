include node_modules/systematic/mk/main.mk

PACKAGE_VERSION ?= $(call read_package,version)

docker_image: clean dist
	docker build . --tag cocolarp:$(PACKAGE_VERSION)
	docker save --output cocolarp-$(PACKAGE_VERSION).tar cocolarp:$(PACKAGE_VERSION)
