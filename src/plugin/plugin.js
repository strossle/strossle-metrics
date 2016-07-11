const { NotImplementedError } = require('../error.js');

class Plugin {
    init() {
        throw new NotImplementedError('Plugin must implement init');
    }

    isStatic() {
        throw new NotImplementedError('Plugin must implement isStatic');
    }

    getData() {
        throw new NotImplementedError('Plugin must implement getData');
    }
}

module.exports = Plugin;
