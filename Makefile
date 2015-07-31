BABEL?=babel

run:
	python -m SimpleHTTPServer

install:
	npm install --global babel

build:
	$(BABEL) src --out-dir scripts

watch:
	$(BABEL) src --watch --out-dir scripts
