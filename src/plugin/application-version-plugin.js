const Plugin = require('./plugin.js');
const path = require('path');
const pkg = require(path.join(process.cwd(), 'package.json'));

class ApplicationVersion extends Plugin {
    constructor(options = { keyName: 'application_version' }) {
        super();

        const { keyName } = options;

        this.version = pkg.version;
        this.keyName = keyName;
    }

    getData() {
        return { [this.keyName]: this.version };
    }
}

module.exports = ApplicationVersion;

