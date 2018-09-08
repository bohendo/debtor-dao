# Variable

project=debtordao
proxy_image="$(project)_proxy"

VPATH=src:ops:build

webpack=node_modules/.bin/webpack
truffle=node_modules/.bin/truffle
abi-gen=node_modules/.bin/abi-gen
tsc=node_modules/.bin/tsc
copyfiles=node_modules/.bin/copyfiles

src=$(shell find src -type f)
ops=$(shell find ops -type f)
contracts=$(shell find contracts -type f)
tests=$(shell find test -type f)
migrations=$(shell find migrations -type f)

$(shell mkdir -p build)

# Rules

all: proxy-image

test: migrate transpile

clean:
	rm -rf build/*

push: proxy-image
	docker push bohendo/$(proxy_image)

proxy-image: bundle.js build/index.html $(ops)
	docker build -f ops/proxy.Dockerfile -t $(proxy_image) .
	touch build/proxy-image

bundle.js: node-modules webpack.js $(src) transpile
	$(webpack) --config ./ops/webpack.js

transpile: abis $(tests)
	rm -rf ./transpiled
	$(copyfiles) ./build/**/* ./transpiled
	$(tsc) --project ./tsconfig-test.json || true
	touch build/transpile

abis: compile
	$(abi-gen) --abis './build/contracts/*.json' --out './types/generated' --template './types/contract_templates/contract.mustache' --partials './types/contract_templates/partials/*.mustache'
	touch build/abis

migrate: compile $(migrations)
	$(truffle) migrate
	touch build/migrate

compile: $(contracts)
	$(truffle) compile
	touch build/compile

node-modules: package.json
	yarn install
	touch build/node-modules
