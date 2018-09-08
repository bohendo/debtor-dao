# Variable

project=debtordao
proxy_image="$(project)_proxy"

VPATH=src:ops:build

webpack=node_modules/.bin/webpack

src=$(shell find src -type f -name "*.js")
ops=$(shell find ops -type f)
#contracts=$(shell find contracts -type f -name "*.json")

$(shell mkdir -p build)

# Rules

all: proxy-image

clean:
	rm -rf build/*

push: proxy-image
	docker push bohendo/$(proxy_image)

proxy-image: bundle.js $(ops)
	docker build -f ops/proxy.Dockerfile -t $(proxy_image) .
	touch build/proxy-image

bundle.js: node-modules webpack.js $(src)
	$(webpack) --config ./ops/webpack.js

node-modules: package.json
	yarn install
	touch build/node-modules
