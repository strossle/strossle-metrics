const Plugin = require('./plugin.js');

class Node extends Plugin {
    constructor(options = { keyName: 'node_version' }) {
        super();

        const { keyName } = options;

        this.version = process.version;
        this.keyName = keyName;
    }

    getData() {
        return { [this.keyName]: this.version };
    }
}

module.exports = Node;

