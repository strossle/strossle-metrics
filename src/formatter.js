const { NotImplementedError } = require('./error.js');

class Formatter {
    format() {
        throw new NotImplementedError('Formatter#format must be implemented by sub class');
    }
}

module.exports = Formatter;
