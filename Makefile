#make flow
#
#dist:  final, statically served, version controlled assets
#build: intermediate non-version-controlle build-time files
#make:  scripts and dynamic makefiles for building. things that make the makefile work. version controlled
#src:   version controlled source files where all development occurs 
#
# 
#dist/js                         - all combined, minified non-template javascript
# \              copy/minify
# build/js/post                  - all combined, unminified non-template javascript
###\             preprocess
###build/js/pre                  - copied javascript; compiled typescript
#   \            copy
#   src/js                       - original source javascript
#   \            compile (tsc)
#   src/ts                       - original source typescript and compiled typescript
#
#
#dist/templates                  - all combined, minified client template javascript
# \              copy/minify
# build/templates                - combined client scripts
#  \             preprocess
#   views/client                 - client scripts (just an include list)
#   views                        - dust templates compiled to js
#   \            compile (dustc)
#   views                        - dust template source
#
#
#dist/css                        - all combined, minified plain css
# \
# src/less                       - less css source files
#
#
#make/

DIST_JS_FILES = $(shell find -f dist/js)
RULES = $(shell find -f make/*.rule)
CLIENT_DUST = $(shell find dist/templates -name "*.js")
CLIENT_TEMPLATES = $(shell find dist/templates -name "*.js")
SERVER_DUST = $(shell find views -name "*.dust")
SERVER_TEMPLATES = $(patsubst %.dust,%.js,$(SERVER_DUST))

#use $(call) with these:
PREPROCESS       = make/preprocess-with-deps.js $(1) --deps $(patsubst build_%,make/gen/%.deps,$(subst /,_,$(2))) --out $(2)
TSC              = tsc -sourcemap -target ES3 -out $(2) $(1)
DUSTC            = node_modules/dustjs-linkedin/bin/dustc $(1) > $(2)

#TODO: do we want to minify here? 
DO_MINIFY        =
MINIFY           =


#anything with a preprocessor dependency will put a makefile rule here
-include make/gen/*.deps

all: dirs js templates client-templates

dirs: | build/js build/templates make/gen

build/js:
	mkdir -p build/js
build/templates:
	mkdir -p build/templates
make/gen:
	mkdir -p make/gen

rules: 

js: $(DIST_JS_FILES)

dist/js/%.js: build/js/%.js
ifdef DO_MINIFY
	$(MINIFY) $< > $@
else
	cp $< $@
endif

#no need to preprocess 3rd party files, so keep them in ext/
build/js/%.js: src/js/ext/%.js
	cp $< $@

#src/js and src/ts are separate to prevent confusion about which files to edit, and to hide/ignore generated files
#we copy them both to pre/ so there can be one preprocess step targeting them both
#build/js/post/%.js: build/js/pre/%.js
#	$(call PREPROCESS,$<,$@)
#build/js/pre/%.js: src/js/%.js
#	cp $< $@
#build/js/pre/%.js: src/ts/%.js
#	cp $< $@

#our preprocess script tracks dependencies and write sub-makefiles for them
build/js/%.js: src/js/%.js
	$(call PREPROCESS,$<,$@)
build/js/%.js: src/ts/%.js
	$(call PREPROCESS,$<,$@)


#compile typescript to its own directory
src/ts/%.js: src/ts/%.ts
	$(call TSC,$<,$@)

#
#  Templates
#

client-templates: templates $(CLIENT_TEMPLATES)

templates: $(SERVER_TEMPLATES)

dist/templates/%.js: build/templates/%.js
ifdef DO_MINIFY
	$(MINIFY) $< > $@
else
	cp $< $@
endif

build/templates/%.js: views/client/%.js
	$(call PREPROCESS,$<,$@)

views/%.js: views/%.dust
	$(call DUSTC,$<,$@)


# We need dist to know what our targets are.
clean:
	rm -rf build/*
	@#rm -f make/gen/*

test:
	# Please give me some automated tests!

deps:
	$(eval DEPS := $(patsubst templates/%.deps,views/client/%,$(subst _,/,$(shell ls make/gen))))
	@echo $(DEPS)



.DEFAULT_GOAL := all
 
.PHONY: clean js css templates client-templates test deps

debug:
	echo $(SERVER_TEMPLATES)