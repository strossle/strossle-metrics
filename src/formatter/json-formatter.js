const Formatter = require('./formatter.js');

class JSONFormatter extends Formatter {
    format(measurement, values, optionals = {}) {
        const { timestamp } = optionals;
        return JSON.stringify({ measurement, values, timestamp });
    }
}

module.exports = JSONFormatter;

