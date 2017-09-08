require('util.promisify/shim')();

const {promisify} = require('util');
const fs = require('fs');
const readFile = promisify(fs.readFile);

class DocMerger {
    constructor () {
        this.analysis = {
            elements: []
        };
    }
    addAnalysis (analysis) {
        if (!this.analysis.schema_version) {
            this.analysis.schema_version = analysis.schema_version;
        } else if (this.analysis.schema_version !== analysis.schema_version) {
            throw new Error('The schema version of all the analysis are not the same');
        }
        return this.analysis.elements = this.analysis.elements.concat(analysis.elements);
    }
    getAnalysis () {
        return this.analysis;
    }
}

module.exports = DocMerger;