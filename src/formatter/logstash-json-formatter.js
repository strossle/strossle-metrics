const Formatter = require('./formatter.js');

class LogstashJSON extends Formatter {
    format(measurement, values, optionals = {}) {
        const { tags, timestamp, pluginData } = optionals;
        const data = Object.assign({ measurement, '@timestamp': timestamp }, values, pluginData);
        return `${JSON.stringify(data)}\n`;
    }
}

module.exports = LogstashJSON;

