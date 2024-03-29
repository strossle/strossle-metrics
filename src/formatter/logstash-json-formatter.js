const Formatter = require('./formatter.js');

class LogstashJSON extends Formatter {
    format(measurement, values, optionals = {}) {
        const { tags, timestamp, pluginData } = optionals;
        let data;
        if (timestamp) {
            data = Object.assign(
                {
                    measurement,
                    '@timestamp': timestamp,
                },
                values,
                tags,
                pluginData
            );
        } else {
            data = Object.assign(
                {
                    measurement,
                },
                values,
                tags,
                pluginData
            );
        }
        return `${JSON.stringify(data)}\n`;
    }
}

module.exports = LogstashJSON;

