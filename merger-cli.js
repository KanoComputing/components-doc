require('util.promisify/shim')();

const {promisify} = require('util');
const fs = require('fs');
const path = require('path');
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);

const argv = require('yargs').argv;

const DocMerger = require('./merger');

const sources = Array.isArray(argv.source) ? argv.source : [argv.source];

const sourceDir = argv.sourceDir;

const out = argv.out;

const merger = new DocMerger();

let prepare = Promise.resolve(sources);

if (!!sourceDir) {
    prepare = readdir(sourceDir)
        .then(contents => contents.filter(file => file.endsWith('.json')))
        .then(files => files.map(file => path.join(sourceDir, file)));
}

prepare.then(sources => {
    const tasks = sources.map(source => {
        return readFile(source, 'utf-8')
            .then(buffer => {
                return JSON.parse(buffer.toString());
            })
            .then(analysis => merger.addAnalysis(analysis));
    });
    return Promise.all(tasks);
}).then(() => {
    return writeFile(argv.out, JSON.stringify(merger.getAnalysis()));
}).then(() => console.log('done'));
