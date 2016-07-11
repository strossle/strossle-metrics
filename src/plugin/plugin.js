const { NotImplementedError } = require('../error.js');

class Plugin {
    getData() {
        throw new NotImplementedError('Plugin must implement getData');
    }
}

module.exports = Plugin;
