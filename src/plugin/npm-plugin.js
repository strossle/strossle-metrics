const Plugin = require('./plugin.js');
const path = require('path');
const pkg = require(path.join(process.cwd(), 'package.json'));

class Npm extends Plugin {
    constructor(options = { keyName: 'npm_version' }) {
        super();

        const { keyName } = options;

        this.version = pkg.version;
        this.keyName = keyName;
    }

    getData() {
        return { [this.keyName]: this.version };
    }
}

module.exports = Npm;

