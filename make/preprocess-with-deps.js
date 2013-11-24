#!/usr/bin/env node
/*
 Copyright 2013 Daniel Wirtz <dcode@dcode.io>

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/**
 * Preprocessor.js: preprocess Command Line Utility (c) 2013 Daniel Wirtz <dcode@dcode.io>
 * Released under the Apache License, Version 2.0
 * see: https://github.com/dcodeIO/Preprocessor.js for details
 */

var Preprocessor = require("preprocessor"),
    path = require("path"),
    fs = require("fs"),
    pkg = require(__dirname+"/../package.json");

if (process.argv.length < 3) {
    console.log("Preprocessor.js "+pkg.version+" - https://github.com/dcodeIO/Preprocessor.js\n");
    console.log("  Usage: "+path.basename(process.argv[1])+" sourceFile [baseDirectory] [--deps=depsFile] --out=outFile [-myKey[=myValue], ...]");
    process.exit(11);
}
var sourceFile = process.argv[2];
var baseDir = ".", i=3;
if (process.argv.length > i && process.argv[i].indexOf("=") < 0 && process.argv[i].indexOf("--") != 0) {
    baseDir = process.argv[i];
    i++;
}
var depsFile = null;
if (process.argv[i].substring(0,6) == '--deps'){
	var depsFile = process.argv[i].substring(7);
	i++;

	if (!depsFile){
		depsFile = process.argv[i];
		i++;
	}
}

var outFile = null;
if (process.argv[i].substring(0,5) == '--out'){
	var outFile = process.argv[i].substring(6);
	i++;

	if (!outFile){
		outFile = process.argv[i];
		i++;
	}
}

var directives = {};
for (;i<process.argv.length; i++) {
    if (process.argv[i].substring(0,1) != '-') {
        console.log("Illegal directive: "+process.argv[i]);
        process.exit(12);
    }
    var d = process.argv[i].substring(1).split("=");
    if (d.length > 2) {
        console.log("Illegal directive: "+process.argv[i]);
        process.exit(12);
    }
    var val;
    if (d.length == 1 || d[1].toLowerCase() === "true") {
        val = true;
    } else if (d[1].toLowerCase() === "false") {
        val = false;
    } else if (d[1].toLowerCase() === "null") {
        val = null;
    } else {
        val = d[1];
    }
    directives[d[0]] = val;
}
var source = fs.readFileSync(sourceFile)+"";
var pp = new Preprocessor(source, baseDir);
var out = pp.process(directives);

if (depsFile){
	var depsRule = outFile + ' : ' + sourceFile;
	var hasIncludes = false;
	for (var depFilename in pp.includes){
		hasIncludes = true;
		depsRule += ' ' + depFilename;
	}
	if (hasIncludes){
		var recipe = "\t$(call PREPROCESS,$<,$@)";
		depsRule += '\n' + recipe + '\n';
		fs.writeFileSync(depsFile, depsRule);
	}
}

if (outFile){
	fs.writeFileSync(outFile, out);
}
else {
	console.log(out);
}

process.exit(0);
