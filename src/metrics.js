const { InvalidFormatterError, InvalidOutputError } = require('./error.js');
const Formatter = require('./formatter/formatter.js');
const Output = require('./output/output.js');
const Stdout = require('./output/stdout-output.js');
const InfluxDBLineProtocol = require('./formatter/influxdb-line-protocol-formatter.js');

class Metrics {
    constructor(options = { formatter: new InfluxDBLineProtocol(), output: new Stdout() }) {
        const { formatter, output } = options;

        if (!formatter instanceof Formatter) {
            throw new InvalidFormatterError('formatter must be an instance of Formatter');
        }
        this.formatter = formatter;

        if (!output instanceof Output) {
            throw new InvalidOutputError('output must be an instance of Output');
        }
        this.output = output;
    }

    send(metric, values, optionals = {}, callback) {
        const { tags, timestamp } = optionals;
        let callbackFunc = callback;
        if (callback === undefined && typeof optionals === 'function') {
            callbackFunc = optionals;
        }

        const data = this.formatter.format(metric, values, { tags, timestamp });

        this.output.send(data, callbackFunc);
    }
}

module.exports = Metrics;
