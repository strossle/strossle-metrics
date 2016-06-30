const { NotImplementedError } = require('./error.js');

class Output {
    send() {
        throw new NotImplementedError('Output#send must be implemented by sub class');
    }
}

module.exports = Output;
